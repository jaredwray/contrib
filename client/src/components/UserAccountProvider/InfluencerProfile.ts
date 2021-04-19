import { TermsInput } from 'src/types/TermsInput';

export interface InfluencerProfile {
  id: string;
  notAcceptedTerms: TermsInput | null;
}
