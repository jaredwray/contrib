import { gql } from 'apollo-server-express';

export const NotificationSchema = gql`
  enum NotificationStatus {
    DONE
    PENDING
    PAUSED
  }

  type Notification {
    id: String
    createdBy: UserAccount
    recipients: InfluencerProfile[]
    status: String
    message: String
    sendAt: DateTime
    createdAt: DateTime
    updatedAt: DateTime
  }

  type NotificationsList {
    items: [Notification]!
    totalItems: Int!
    size: Int!
    skip: Int!
  }

  input NotificationInput {
    recipients: InfluencerProfile[]
    message: String
    sendAt: DateTime
  }
  input NotificationsParams {
    skip: Int
    size: Int
    filters: InvitationFilters
  }
  input InvitationFilters {
    query: String
  }

  extend type Query {
    notification(id: String!): Invitation
    notifications(params: NotificationsParams): NotificationsList!
  }

  extend type Mutation {
    createNotification(input: NotificationInput!): Notification
  }
`;
