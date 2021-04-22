import compareVersions from 'compare-versions';

const VERSION = '1.0';

export class TermsService {
  public static notAcceptedTerms(lastAcceptedTerms: string | null): string | null {
    if (compareVersions(VERSION, lastAcceptedTerms || '0') === 1) {
      return VERSION;
    }
  }

  public static isValidVersion(version: string): boolean {
    return compareVersions(VERSION, version) < 1;
  }
}
