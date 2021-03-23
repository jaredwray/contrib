import { gql } from '@apollo/client';

export const UpdateInfluencerProfileMutation = gql`
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

export const UpdateInfluencerProfileAvatarMutation = gql`
  mutation UpdateInfluencerProfileAvatar($image: Upload!) {
    updateMyInfluencerProfileAvatar(image: $image) {
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
