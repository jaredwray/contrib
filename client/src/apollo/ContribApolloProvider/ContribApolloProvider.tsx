import { useMemo } from 'react';

import { ApolloClient, ApolloProvider, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useAuth0 } from '@auth0/auth0-react';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';

interface PropTypes {
  children: any;
}

export function ContribApolloProvider({ children }: PropTypes) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const apolloClient = useMemo(() => {
    const httpLink: any = createUploadLink({
      uri: process.env.REACT_APP_API_URL,
    });

    const wsLink = new WebSocketLink({
      uri: process.env.REACT_APP_API_URL?.replace(/^(https|http)/, 'ws') as string,
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

    const authLink = setContext(async (_, { headers }) => {
      if (!isAuthenticated) {
        return headers;
      }

      try {
        const accessToken = await getAccessTokenSilently();
        return {
          headers: {
            ...headers,
            authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        return headers;
      }
    });

    return new ApolloClient({
      link: ApolloLink.from([authLink as any, splitLink as any]) as any,
      cache: new InMemoryCache(),
      connectToDevTools: process.env.NODE_ENV === 'development',
    });
  }, [getAccessTokenSilently, isAuthenticated]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
