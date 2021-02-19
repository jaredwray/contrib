import { ClientSession, Connection, ObjectId } from 'mongoose';
import { IInfluencer, InfluencerModel } from '../mongodb/InfluencerModel';
import { InfluencerProfile } from '../dto/InfluencerProfile';
import { InfluencerStatus } from '../dto/InfluencerStatus';
import { UpdateInfluencerProfileInput } from '../graphql/model/UpdateInfluencerProfileInput';
import { Storage } from '@google-cloud/storage';
import { AppConfig } from '../../../config';
import { v4 as uuidv4 } from 'uuid';

interface InfluencerInput {
  name: string;
  avatarUrl: string;
  userAccount: string | null;
}

export class InfluencerService {
  private readonly InfluencerModel = InfluencerModel(this.connection);

  constructor(private readonly connection: Connection) {}

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
        },
      ],
      { session },
    );
    return InfluencerService.makeInfluencerProfile(influencer[0]);
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

  async updateInfluencerProfileAvatarByUserId(
    userAccount: string,
    image: any,
  ): Promise<InfluencerProfile> {
    const influencer = await this.InfluencerModel.findOne({ userAccount }).exec();
    if (!influencer) {
      throw new Error(`influencer record not found for user account ${userAccount}`);
    }

    const { filename: originalFilename, createReadStream } = await image

    const extension = originalFilename.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;
    const bucketName = AppConfig.googleCloud.bucketName;
    const path = require('path');
    const storage = new Storage({ keyFilename: path.join(__dirname, '../../../.secrets-google-cloud.json') });

    await createReadStream().pipe(
      storage.bucket(bucketName).file(filename).createWriteStream().on("finish", () => {
        storage.bucket(bucketName).file(filename).makePublic()
          .then(() => {
            let oldFileName = influencer.avatarUrl.split('/').pop();

            influencer.avatarUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
            influencer.save();

            storage.bucket(bucketName).file(oldFileName).delete()
              .catch((e : any) => console.log(`cannot delete https://storage.googleapis.com/${bucketName}/${oldFileName} file : ${e}`) );
          })
          .catch((e : any) => console.log(`exec error : ${e}`) );
      })
    );

    return InfluencerService.makeInfluencerProfile(influencer);
  }

  private static makeInfluencerProfile(model: IInfluencer): InfluencerProfile {
    return {
      id: model._id.toString(),
      name: model.name,
      sport: model.sport,
      team: model.team,
      profileDescription: model.profileDescription,
      avatarUrl: model.avatarUrl,
      status: model.status,
      userAccount: model.userAccount?.toString() ?? null,
    };
  }
}
