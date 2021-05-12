import {ApolloClient, InMemoryCache, concat, ApolloLink, HttpLink} from "@apollo/client";

const BASE_URL = process.env.REACT_APP_BASE_API_URL || 'http://localhost:2000/graphql';

const httpLink = new HttpLink({ uri: BASE_URL });

const authMiddleware = new ApolloLink(((operation, forward) => {

    // add the authorization to the headers
    let auth = localStorage.getItem('@auth');
    if(auth){
        auth = JSON.parse(auth);
        operation.setContext({
            headers: {
                Authorization: `Bearer ${auth.accessToken}`,
            }
        });
    }

    return forward(operation);
}));

const client = new ApolloClient({
    uri: BASE_URL,
    cache: new InMemoryCache(),
    link: concat(authMiddleware,httpLink)
});

export default client;
