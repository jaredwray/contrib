import { ClientSession, Connection } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { ShortLink } from '../dto/ShortLink';
import { ShortLinkModel, IShortLinkModel } from '../mongodb/ShortLinkModel';

import { AppConfig } from '../../../config';
import { AppLogger } from '../../../logger';

export class ShortLinkService {
  private readonly shortLinkModel = ShortLinkModel(this.connection);

  constructor(private readonly connection: Connection) {}

  private generateSlug(): string {
    return uuidv4().split('-')[0];
  }

  private async uniqSlug(): Promise<string> {
    let slug;

    do {
      slug = this.generateSlug();
    } while (await this.shortLinkModel.exists({ slug }));

    return slug;
  }

  public static makeLink({ address, slug }: { address?: string; slug?: string }): string {
    const url = new URL(AppConfig.app.url.origin);

    if (address) {
      url.pathname = `/${address}`;
    }
    if (slug) {
      url.pathname = `/go/${slug}`;
    }

    return url.toString();
  }

  public async createShortLink(
    { address, path }: { address?: string; path?: string },
    session?: ClientSession,
  ): Promise<ShortLink> {
    const link = path || ShortLinkService.makeLink({ address });
    const slug = await this.uniqSlug();

    const [model] = await this.shortLinkModel.create(
      [
        {
          slug,
          link,
        },
      ],
      { session },
    );

    return ShortLinkService.makeShortLink(model);
  }

  public async getLink(slug: string): Promise<ShortLink | null> {
    const model = await this.shortLinkModel.findOne({ slug });

    if (!model) return null;

    return ShortLinkService.makeShortLink(model);
  }

  public static makeShortLink(model: IShortLinkModel): ShortLink {
    const { _id, slug, ...rest } = 'toObject' in model ? model.toObject() : model;

    return {
      id: _id.toString(),
      slug,
      shortLink: ShortLinkService.makeLink({ slug }),
      ...rest,
    };
  }
}
