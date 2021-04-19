import { gql } from '@apollo/client';

export const TermsListQuery = gql`
  query TermsList {
    terms {
      userAccount {
        version
        date
      }
      assistant {
        version
        date
      }
      influencer {
        version
        date
      }
    }
  }
`;

export const AcceptAccountTermsMutation = gql`
  mutation acceptAccountTerms($version: String!) {
    acceptAccountTerms(version: $version) {
      id
    }
  }
`;

export const AcceptInfluencerTermsMutation = gql`
  mutation acceptInfluencerTerms($version: String!) {
    acceptInfluencerTerms(version: $version) {
      id
    }
  }
`;

export const AcceptAssistantTermsMutation = gql`
  mutation acceptAssistantTerms($version: String!) {
    acceptAssistantTerms(version: $version) {
      id
    }
  }
`;
