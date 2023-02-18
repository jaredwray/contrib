import { makeVar } from '@apollo/client';

export const returnUrlVar = makeVar<string | null>(null);
