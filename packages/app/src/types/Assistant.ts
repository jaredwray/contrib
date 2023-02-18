export interface AssistantInfluencer {
  influencerId: string;
  createdAt: string;
}

export interface Assistant {
  id: string;
  name: string;
  status: string;
  influencerId?: string;
  influencerIds: [string];
  influencers: [AssistantInfluencer];
}
