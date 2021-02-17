import { Connection } from 'mongoose';
import { ICharityModel, CharityModel } from '../mongodb/CharityModel';
import { Charity } from '../dto/Charity';
import { CharityInput } from '../graphql/model/CharityInput';

export class CharityService {
  private readonly CharityModel = CharityModel(this.connection);
  constructor(private readonly connection: Connection) {}

  async createCharity({ name }: CharityInput): Promise<Charity | null> {
    const [charity] = await this.CharityModel.create([{ name }]);
    return CharityService.makeCharity(charity);
  }

  async searchForCharity({ name }: CharityInput): Promise<Charity[] | null> {
    const charities = await this.CharityModel.find({ $text: { $search: name } }).exec();
    return charities.map(CharityService.makeCharity);
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
    };
  }
}
