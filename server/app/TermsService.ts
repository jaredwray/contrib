import compareVersions from 'compare-versions';
import { AppConfig } from '../config';

export class TermsService {
  public static notAcceptedTerms(lastAcceptedTerms: string | null, accountEntityTypes?): string | null {
    if (accountEntityTypes) {
      const { assistant, charity, influencer } = accountEntityTypes;
      if (charity && (!influencer && !assistant)) {
        return null;
      }
    }

    if (compareVersions(AppConfig.terms.version, lastAcceptedTerms || '0') === 1) {
      return AppConfig.terms.version;
    }
  }

  public static isValidVersion(version: string): boolean {
    return compareVersions(AppConfig.terms.version, version) < 1;
  }
}
