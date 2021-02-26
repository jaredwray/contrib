import { useMemo } from 'react';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from '@auth0/auth0-react';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';

interface PropTypes {
  children: any;
}

export function ContribApolloProvider({ children }: PropTypes) {
  const { getAccessTokenSilently } = useAuth0();

  const apolloClient = useMemo(() => {
    const httpLink = createUploadLink({ uri: process.env.REACT_APP_API_URL });

    const authLink = setContext(async (_, { headers }) => {
      try {
        const accessToken = await getAccessTokenSilently();
        return {
          headers: {
            ...headers,
            authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        };
      } catch (error) {
        console.error('error getting access token', error);
        return {};
      }
    });

    return new ApolloClient({
      link: ApolloLink.from([authLink as any, httpLink as any]) as any,
      cache: new InMemoryCache(),
    });
  }, [getAccessTokenSilently]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
