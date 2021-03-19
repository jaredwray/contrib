import { Storage } from '@google-cloud/storage';
import { ClientSession, Connection, ObjectId } from 'mongoose';
import { IInfluencer, InfluencerModel } from '../mongodb/InfluencerModel';
import { CharityService } from '../../Charity/service/CharityService';
import { InfluencerProfile } from '../dto/InfluencerProfile';
import { InfluencerStatus } from '../dto/InfluencerStatus';
import { UpdateInfluencerProfileInput } from '../graphql/model/UpdateInfluencerProfileInput';
import { AppConfig } from '../../../config';
import { AppLogger } from '../../../logger';

interface InfluencerInput {
  name: string;
  avatarUrl: string;
  userAccount: string | null;
}

export class InfluencerService {
  private readonly InfluencerModel = InfluencerModel(this.connection);

  constructor(private readonly connection: Connection, private readonly charityService: CharityService) {}

  async createInfluencer(
    { name, avatarUrl, userAccount }: InfluencerInput,
    session: ClientSession,
  ): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.create(
      [
        {
          name,
          avatarUrl,
          userAccount,
          status: userAccount ? InfluencerStatus.ONBOARDED : InfluencerStatus.INVITATION_PENDING,
          favoriteCharities: [],
        },
      ],
      { session },
    );
    return InfluencerService.makeInfluencerProfile(influencer[0]);
  }

  async findInfluencer(id: string): Promise<InfluencerProfile | null> {
    const influencer = await this.InfluencerModel.findById(id).exec();
    return (influencer && InfluencerService.makeInfluencerProfile(influencer)) ?? null;
  }

  async findInfluencerByUserAccount(userAccount: string): Promise<InfluencerProfile | null> {
    const influencer = await this.InfluencerModel.findOne({ userAccount }).exec();
    return (influencer && InfluencerService.makeInfluencerProfile(influencer)) ?? null;
  }

  async listInfluencers(skip: number, size: number): Promise<InfluencerProfile[]> {
    const models = await this.InfluencerModel.find().skip(skip).limit(size).sort({ id: 'asc' }).exec();

    return models.map((m) => InfluencerService.makeInfluencerProfile(m));
  }

  async listInfluencersByUserAccountIds(userAccountIds: readonly string[]): Promise<InfluencerProfile[]> {
    const models = await this.InfluencerModel.find({ userAccount: { $in: userAccountIds } });
    return models.map((influencer) => InfluencerService.makeInfluencerProfile(influencer));
  }

  async countInfluencers(): Promise<number> {
    return this.InfluencerModel.countDocuments().exec();
  }

  async assignUserToInfluencer(
    id: ObjectId,
    userAccountId: string,
    session: ClientSession,
  ): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.findById(id, null, { session }).exec();
    if (!influencer) {
      throw new Error(`cannot assign user to influencer: influencer ${id} is not found`);
    }

    if (influencer.status !== InfluencerStatus.INVITATION_PENDING) {
      throw new Error(`cannot assign user to influencer: influencer ${id} status is ${influencer.status} `);
    }

    if (influencer.userAccount) {
      throw new Error(`cannot assign user to influencer: influencer ${id} already has a user account assigned`);
    }

    influencer.userAccount = userAccountId;
    influencer.status = InfluencerStatus.ONBOARDED;
    await influencer.save();

    return InfluencerService.makeInfluencerProfile(influencer);
  }

  async updateInfluencerProfileByUserId(
    userAccount: string,
    input: UpdateInfluencerProfileInput,
  ): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.findOne({ userAccount }).exec();
    if (!influencer) {
      throw new Error(`influencer record not found for user account ${userAccount}`);
    }

    Object.assign(influencer, input);

    await influencer.save();

    return InfluencerService.makeInfluencerProfile(influencer);
  }

  async updateInfluencerProfileAvatarByUserId(userAccount: string, image: any): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.findOne({ userAccount }).exec();
    if (!influencer) {
      throw new Error(`influencer record not found for user account ${userAccount}`);
    }

    const { filename: originalFilename, createReadStream } = await image;
    const ALLOWED_EXTENSIONS = ['png', 'jpeg', 'jpg', 'webp'];
    const extension = originalFilename.split('.').pop();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      AppLogger.error('File has unsupported extension: ', originalFilename);
      return;
    }

    const filename = `${influencer._id}/avatar/avatar.webp`;
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
              influencer.avatarUrl = `${bucketFullPath}/${filename}`;
              influencer.save();
            })
            .catch((e: any) => AppLogger.error(`exec error : ${e}`));
        }),
    );

    return InfluencerService.makeInfluencerProfile(influencer);
  }

  async updateInfluencerProfileFavoriteCharitiesByUserId(
    userAccount: string,
    charities: [string],
  ): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.findOne({ userAccount }).exec();
    if (!influencer) {
      throw new Error(`influencer record not found for user account ${userAccount}`);
    }

    const favoriteCharities = await this.charityService.listCharitiesByIds(charities);
    influencer.favoriteCharities = favoriteCharities.map((m) => m.id);

    await influencer.save();

    return InfluencerService.makeInfluencerProfile(influencer);
  }

  public static makeInfluencerProfile(model: IInfluencer): InfluencerProfile {
    return {
      id: model._id.toString(),
      name: model.name,
      sport: model.sport,
      team: model.team,
      profileDescription: model.profileDescription,
      avatarUrl: model.avatarUrl,
      status: model.status,
      userAccount: model.userAccount?.toString() ?? null,
      favoriteCharities: model.favoriteCharities?.map((m) => m.toString()) ?? [],
    };
  }
}
