import {ApolloCache, ApolloClient, ApolloLink, concat, DefaultOptions, HttpLink, InMemoryCache} from "@apollo/client";
import {AuthenticationTicket} from "../redux/features/authSlice";

const BASE_URL: string = process.env.REACT_APP_BASE_API_URL || 'http://localhost:2000/graphql';

const httpLink = new HttpLink({uri: BASE_URL});

const authMiddleware = new ApolloLink(((operation, forward) => {

    // add the authorization to the headers
    let auth = localStorage.getItem('@auth');
    if (auth) {
        const payload = JSON.parse(auth) as AuthenticationTicket;
        operation.setContext({
            headers: {
                Authorization: `Bearer ${payload.accessToken}`,
            }
        });
    }

    return forward(operation);
}));

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}


const client = new ApolloClient({
    uri: BASE_URL,
    cache: new InMemoryCache(),
    link: concat(authMiddleware, httpLink),
    defaultOptions: defaultOptions
});


export default client;
