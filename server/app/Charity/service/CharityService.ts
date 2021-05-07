import { Storage } from '@google-cloud/storage';
import { GCloudStorage } from '../../GCloudStorage';
import { ClientSession, Connection, ObjectId } from 'mongoose';
import { CharityModel, ICharityModel } from '../mongodb/CharityModel';
import { Charity } from '../dto/Charity';
import { CharityInput } from '../graphql/model/CharityInput';
import { CharityStatus } from '../dto/CharityStatus';
import { CharityProfileStatus } from '../dto/CharityProfileStatus';
import { CharityStripeStatus } from '../dto/CharityStripeStatus';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { UpdateCharityProfileInput } from '../graphql/model/UpdateCharityProfileInput';
import { EventHub } from '../../EventHub';
import { Events } from '../../Events';
import { StripeService } from '../../Payment';
import { AppConfig } from '../../../config';
import { AppLogger } from '../../../logger';
interface CharityCreationInput {
  name: string;
}
export class CharityService {
  private readonly CharityModel = CharityModel(this.connection);
  private readonly stripe = new StripeService();
  constructor(private readonly connection: Connection, private readonly eventHub: EventHub) {
    eventHub.subscribe(Events.CHARITY_ONBOARDED, async (charity) => {
      await this.createStripeAccoutForCharity(charity);
    });
  }
  async createStripeAccoutForCharity(charity: Charity): Promise<Charity> {
    const session = await this.CharityModel.startSession();
    const model = await this.CharityModel.findById(charity.id, null, { session }).exec();
    model.status = CharityStatus.PENDING_ONBOARDING;
    const stripeAccount = await this.stripe.createStripeAccount();
    model.stripeAccountId = stripeAccount.id;
    await model.save();
    return CharityService.makeCharity(model);
  }
  async maybeUpdateStripeLink(charity: Charity): Promise<Charity> {
    if (charity.status === CharityStatus.PENDING_INVITE) {
      throw new Error('charity can not exist');
    }
    if (charity.status !== CharityStatus.PENDING_ONBOARDING) {
      return charity;
    }
    const stripeAccountLink = await this.getLinkForStripeAccount(charity);
    const charityUpd = {
      ...charity,
      stripeAccountLink,
    };
    return charityUpd;
  }
  async getLinkForStripeAccount(charity: Charity): Promise<string> {
    const objLink = await this.stripe.createStripeObjLink(charity.stripeAccountId);
    return objLink.url;
  }
  async searchForCharity(query: string): Promise<Charity[]> {
    if (!query) {
      return [];
    }
    const charities = await this.CharityModel.find({ name: { $regex: query, $options: 'i' } }).exec();
    return charities.map(CharityService.makeCharity);
  }
  async createCharity({ name }: CharityCreationInput, session?: ClientSession): Promise<Charity> {
    const charityModel = await this.CharityModel.create(
      [
        {
          name,
          status: CharityStatus.PENDING_INVITE,
          profileStatus: CharityProfileStatus.CREATED,
          stripeStatus: CharityStripeStatus.PENDING_INVITE,
        },
      ],
      { session },
    );
    return CharityService.makeCharity(charityModel[0]);
  }
  async findCharityByUserAccount(userAccount: string): Promise<Charity | null> {
    const charity = await this.CharityModel.findOne({ userAccount }).exec();
    return (charity && CharityService.makeCharity(charity)) ?? null;
  }
  async findCharity(id: string, session?: ClientSession): Promise<Charity | null> {
    const charity = await this.CharityModel.findById(id, null, { session }).exec();
    return (charity && CharityService.makeCharity(charity)) ?? null;
  }
  async updateCharityProfileById(id: string, input: UpdateCharityProfileInput): Promise<Charity> {
    const charity = await this.CharityModel.findOne({ _id: id }).exec();
    if (!charity) {
      throw new Error(`charity record #${id} not found`);
    }
    if (charity.profileStatus === CharityProfileStatus.CREATED) {
      charity.profileStatus = CharityProfileStatus.COMPLETED;
    }
    if (
      charity.profileStatus === CharityProfileStatus.COMPLETED &&
      charity.stripeStatus === CharityStripeStatus.STRIPE_ACTIVE
    ) {
      charity.status = CharityStatus.ACTIVE;
    }
    Object.assign(charity, input);
    await charity.save();
    return CharityService.makeCharity(charity);
  }
  async updateCharityProfileAvatarById(id: string, image: any): Promise<Charity> {
    const charity = await this.CharityModel.findOne({ _id: id }).exec();
    if (!charity) {
      throw new Error(`charity record #${id} not found`);
    }
    const { filename: originalFilename, createReadStream } = await image;
    const ALLOWED_EXTENSIONS = GCloudStorage.allowed_extensions;
    const extension = originalFilename.split('.').pop();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      AppLogger.error('File has unsupported extension: ', originalFilename);
      return;
    }
    const filename = `${charity._id}/avatar/avatar.webp`;
    const filePath = `pending/${filename}`;
    const bucketName = AppConfig.googleCloud.bucketName;
    const storage = new Storage({ credentials: JSON.parse(AppConfig.googleCloud.keyDump) });
    await createReadStream().pipe(
      storage
        .bucket(bucketName)
        .file(filePath)
        .createWriteStream({ metadata: { cacheControl: 'no-store' } })
        .on('finish', () => {
          const bucketFullPath = `https://storage.googleapis.com/${bucketName}`;
          storage
            .bucket(bucketName)
            .file(filePath)
            .makePublic()
            .then(() => {
              charity.avatarUrl = `${bucketFullPath}/${filename}`;
              charity.save();
            })
            .catch((e: any) => AppLogger.error(`exec error : ${e}`));
        }),
    );
    return CharityService.makeCharity(charity);
  }
  async assignUserToCharity(id: ObjectId, userAccountId: string, session: ClientSession): Promise<Charity> {
    const charity = await this.CharityModel.findById(id, null, { session }).exec();
    if (!charity) {
      throw new Error(`cannot assign user to charity: charity ${id} is not found`);
    }
    if (charity.status !== CharityStatus.PENDING_INVITE) {
      throw new Error(`cannot assign user to charity: charity ${id} status is ${charity.status} `);
    }
    if (charity.userAccount) {
      throw new Error(`cannot assign user to charity: charity ${id} already has a user account assigned`);
    }
    charity.userAccount = userAccountId;
    await charity.save();
    return CharityService.makeCharity(charity);
  }
  async updateCharityStatus(
    charity: Charity,
    status: CharityStatus,
    userAccount: UserAccount | null,
    session?: ClientSession,
  ): Promise<Charity> {
    const model = await this.CharityModel.findById(charity.id, null, { session }).exec();
    model.status = status;
    if (userAccount) {
      if (model.userAccount) {
        throw new Error('attempting to override user account for a charity');
      }
      model.userAccount = userAccount.mongodbId;
    }
    await model.save();
    return CharityService.makeCharity(model);
  }
  async updateCharity(id: string, input: CharityInput): Promise<Charity | null> {
    const charity = await this.CharityModel.findById(id).exec();
    if (!charity) {
      throw new Error(`charity record not found`);
    }
    Object.assign(charity, input);
    await charity.save();
    return CharityService.makeCharity(charity);
  }
  async listCharities(skip: number, size: number): Promise<Charity[]> {
    const charities = await this.CharityModel.find().skip(skip).limit(size).sort({ id: 'asc' }).exec();
    return charities.map(CharityService.makeCharity);
  }
  async listCharitiesByUserAccountIds(userAccountIds: readonly string[]): Promise<Charity[]> {
    const models = await this.CharityModel.find({ userAccount: { $in: userAccountIds } });
    return models.map((charity) => CharityService.makeCharity(charity));
  }
  async listCharitiesByIds(charityIds: readonly string[]): Promise<Charity[]> {
    if (charityIds.length === 0) {
      return [];
    }
    const charities = await this.CharityModel.find({ _id: { $in: charityIds } }).exec();
    return charities.map(CharityService.makeCharity);
  }
  async countCharities(): Promise<number> {
    return this.CharityModel.countDocuments().exec();
  }
  private static makeCharity(model: ICharityModel): Charity | null {
    if (!model) {
      return null;
    }
    return {
      id: model._id.toString(),
      name: model.name,
      status: model.status,
      profileStatus: model.profileStatus,
      stripeStatus: model.stripeStatus,
      userAccount: model.userAccount?.toString() ?? null,
      stripeAccountId: model.stripeAccountId,
      avatarUrl: model.avatarUrl ?? `${AppConfig.app.url}/content/img/users/person.png`,
      profileDescription: model.profileDescription,
      websiteUrl: model.websiteUrl,
    };
  }
}
