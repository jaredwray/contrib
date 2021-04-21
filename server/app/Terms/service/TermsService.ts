import compareVersions from 'compare-versions';
import { TermsInput } from '../dto/TermsInput';
import { TermsList } from '../dto/TermsList';

const PRIVACY_AND_TERMS = {
  userAccount: [{ version: '1.0', date: '2021-04-02' }],
  influencer: [{ version: '1.0', date: '2021-04-02' }],
  assistant: [{ version: '1.0', date: '2021-04-02' }],
};

export class TermsService {
  async listTerms(): Promise<TermsList> {
    return {
      userAccount: PRIVACY_AND_TERMS['userAccount'].slice(-1)[0],
      influencer: PRIVACY_AND_TERMS['influencer'].slice(-1)[0],
      assistant: PRIVACY_AND_TERMS['assistant'].slice(-1)[0],
    };
  }

  public static notAcceptedTerms(role: string, lastAcceptedTerms: string | null): TermsInput {
    const lastTerms = PRIVACY_AND_TERMS[role].slice(-1)[0];

    if (lastTerms && compareVersions(lastTerms.version, lastAcceptedTerms || '0') === 1) {
      return lastTerms;
    }
  }

  public static hasVersion(role: string, version: string): boolean {
    return !!PRIVACY_AND_TERMS[role].find((terms) => terms.version === version);
  }
}
