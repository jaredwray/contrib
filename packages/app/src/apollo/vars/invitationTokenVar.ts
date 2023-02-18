import { makeVar } from '@apollo/client';

export const invitationTokenVar = makeVar<string | null>(null);
