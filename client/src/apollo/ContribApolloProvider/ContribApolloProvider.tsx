import { useMemo } from 'react';

import { ApolloClient, ApolloProvider, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';

interface PropTypes {
  children: any;
}

export function ContribApolloProvider({ children }: PropTypes) {
  const apolloClient = useMemo(() => {
    const httpLink: any = createUploadLink({
      uri: process.env.REACT_APP_API_URL,
      credentials: 'include',
    });

    const wsLink = new WebSocketLink({
      uri: process.env.REACT_APP_API_URL?.replace(/^http/, 'ws') as string,
      options: {
        reconnect: true,
      },
    });

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      httpLink,
    );

    const errorLink = onError(({ graphQLErrors }) => {
      if (!graphQLErrors) return;

      graphQLErrors.forEach(({ message }) => {
        if (message.startsWith('Unauthorized')) {
          window.location.href = `/log-in?returnURL=${window.location.pathname}`;
        }
      });
    });

    const authLink = setContext(async (_, { headers }) => headers);

    return new ApolloClient({
      link: ApolloLink.from([authLink as any, errorLink as any, splitLink as any]) as any,
      cache: new InMemoryCache(),
      connectToDevTools: process.env.NODE_ENV === 'development',
      credentials: 'include',
    });
  }, []);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
