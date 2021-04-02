import { gql } from '@apollo/client';

export const UpdateMyInfluencerProfileMutation = gql`
  mutation UpdateInfluencerProfile($name: String!, $sport: String!, $team: String!, $profileDescription: String!) {
    updateMyInfluencerProfile(
      input: { name: $name, sport: $sport, team: $team, profileDescription: $profileDescription }
    ) {
      id
      name
      sport
      team
      profileDescription
      avatarUrl
      status
    }
  }
`;

export const MyProfileQuery = gql`
  query GetMyAccount {
    myAccount {
      influencerProfile {
        id
        profileDescription
        name
        sport
        team
        avatarUrl
        status
        favoriteCharities {
          id
          name
        }
      }
    }
  }
`;

export const UpdateInfluencerProfileMutation = gql`
  mutation UpdateInfluencerProfile(
    $influencerId: String!
    $name: String!
    $sport: String!
    $team: String!
    $profileDescription: String!
  ) {
    updateInfluencerProfile(
      influencerId: $influencerId
      input: { name: $name, sport: $sport, team: $team, profileDescription: $profileDescription }
    ) {
      id
      name
      sport
      team
      profileDescription
      avatarUrl
      status
    }
  }
`;

export const UpdateInfluencerProfileAvatarMutation = gql`
  mutation UpdateInfluencerProfileAvatar($influencerId: String!, $image: Upload!) {
    updateInfluencerProfileAvatar(influencerId: $influencerId, image: $image) {
      id
      profileDescription
      name
      sport
      team
      avatarUrl
      status
    }
  }
`;

export const InfluencerProfileQuery = gql`
  query GetInfluencerProfileById($id: String!) {
    influencer(id: $id) {
      id
      profileDescription
      name
      sport
      team
      avatarUrl
      status
      favoriteCharities {
        id
        name
      }
    }
  }
`;
