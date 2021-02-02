import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setContext } from '@apollo/client/link/context';

interface PropTypes {
  children: any;
}

export function ContribApolloProvider({ children }: PropTypes) {
  const { getAccessTokenSilently } = useAuth0();

  const apolloClient = useMemo(() => {
    const httpLink = createHttpLink({ uri: process.env.REACT_APP_API_URL });

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
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [getAccessTokenSilently]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
