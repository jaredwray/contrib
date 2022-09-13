import { gql } from '@apollo/client';

export const GetCharity = gql`
  query GetCharity($id: String!) {
    charity(id: $id) {
      id
      semanticId
      name
      status
      avatarUrl
      profileDescription
      websiteUrl
      website
      totalRaisedAmount
      followers {
        user
        createdAt
      }
    }
  }
`;

export const GetCharity2 = gql`
  query GetCharity($semanticId: String!) {
    charity(id: $semanticId) {
      id
      semanticId
      name
      status
      avatarUrl
      profileDescription
      websiteUrl
      website
      totalRaisedAmount
      followers {
        user
        createdAt
      }
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

export const FollowCharity = gql`
  mutation FollowCharity($charityId: String!) {
    followCharity(charityId: $charityId) {
      user
      createdAt
    }
  }
`;

export const UnfollowCharity = gql`
  mutation UnfollowCharity($charityId: String!) {
    unfollowCharity(charityId: $charityId) {
      id
    }
  }
`;
