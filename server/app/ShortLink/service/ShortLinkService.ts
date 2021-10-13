import { ClientSession, Connection } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { ShortLink } from '../dto/ShortLink';
import { ShortLinkModel } from '../mongodb/ShortLinkModel';

import { AppConfig } from '../../../config';

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

  private makeLink(adress: string): string {
    const url = new URL(AppConfig.app.url);
    url.pathname = `/${adress}`;
    return url.toString();
  }

  public makeShortLink(slug: string): string {
    const url = new URL(AppConfig.app.url);
    url.pathname = `/go/${slug}`;
    return url.toString();
  }

  public async createShortLink(adress: string, entity: string, session?: ClientSession): Promise<string> {
    const link = this.makeLink(adress);
    const slug = await this.getUniqSlug(uuidv4().split('-')[0]);

    const [shortLink] = await this.shortLinkModel.create(
      [
        {
          slug,
          link,
          entity,
        },
      ],
      { session },
    );

    return shortLink._id.toString();
  }

  public async getLink(slug: string): Promise<ShortLink | null> {
    const shortLinkModel = await this.shortLinkModel.findOne({ slug });

    if (!shortLinkModel) {
      return null;
    }

    const { _id, link, entity, slug: createdSlug } = shortLinkModel;

    return {
      id: _id.toString(),
      link,
      slug: createdSlug,
      entity,
    };
  }
}
