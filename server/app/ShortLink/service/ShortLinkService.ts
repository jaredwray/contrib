import { ClientSession, Connection } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { ShortLink } from '../dto/ShortLink';
import { ShortLinkModel, IShortLinkModel } from '../mongodb/ShortLinkModel';

import { AppConfig } from '../../../config';
import { AppLogger } from '../../../logger';

export class ShortLinkService {
  private readonly shortLinkModel = ShortLinkModel(this.connection);

  constructor(private readonly connection: Connection) {}

  private async getUniqSlug(slug: string): Promise<string> {
    const isExists = await this.shortLinkModel.exists({ slug });
    if (!isExists) {
      return slug;
    }
    const newSlug = uuidv4().split('-')[0];
    return await this.getUniqSlug(newSlug);
  }

  public makeLink({ address, slug }: { address?: string; slug?: string }): string {
    const url = new URL(AppConfig.app.url);

    if (address) {
      url.pathname = `/${address}`;
    }

    if (slug) {
      url.pathname = `/go/${slug}`;
    }
    return url.toString();
  }

  //TODO delete after update short_links
  public async updateShortLinks() {
    try {
      const shortLinkModels = await this.shortLinkModel.find({ entity: { $exists: true } });

      for (const model of shortLinkModels) {
        model.entity = undefined;

        await model.save();
      }
    } catch (error) {
      AppLogger.error(`Something went wrong when try to update short links. Error: ${error.message}`);
    }
  }
  //TODO ends

  public async createShortLink(
    { address, path }: { address?: string; path?: string },
    session?: ClientSession,
  ): Promise<ShortLink> {
    const link = path || this.makeLink({ address });
    const slug = await this.getUniqSlug(uuidv4().split('-')[0]);

    const [model] = await this.shortLinkModel.create(
      [
        {
          slug,
          link,
        },
      ],
      { session },
    );

    return this.makeShortLink(model);
  }

  public async getLink(slug: string): Promise<ShortLink | null> {
    const model = await this.shortLinkModel.findOne({ slug });

    if (!model) return null;

    return this.makeShortLink(model);
  }

  public makeShortLink(model: IShortLinkModel): ShortLink {
    return {
      id: model._id.toString(),
      link: model.link,
      slug: model.slug,
      shortLink: this.makeLink({ slug: model.slug }),
    };
  }
}
