import { gql } from '@apollo/client';

export const GetCharity = gql`
  query GetCharity($id: String!) {
    charity(id: $id) {
      id
      name
      status
      avatarUrl
      profileDescription
      websiteUrl
      website
    }
  }
`;
export const UpdateCharityProfileMutation = gql`
  mutation UpdateCharityProfile($charityId: String!, $profileDescription: String, $website: String, $name: String) {
    updateCharityProfile(
      charityId: $charityId
      input: { profileDescription: $profileDescription, website: $website, name: $name }
    ) {
      id
      name
      profileDescription
      website
    }
  }
`;
export const UpdateCharityProfileAvatarMutation = gql`
  mutation UpdateCharityProfileAvatar($charityId: String!, $image: Upload) {
    updateCharityProfileAvatar(charityId: $charityId, image: $image) {
      id
      name
      avatarUrl
    }
  }
`;
