import {gql} from "@apollo/client/core";

export const ITEM_FRAGMENT = gql`
    fragment itemPayload on Item{
        title
        user_id
        created_at
        last_updated
    }
`

export const USER_FRAGMENT = gql`
    fragment userPayload on User{
        username
        name
        phone
        email
        created_at
        last_updated
    }
`

export const AUTH_TICKET_FRAGMENT = gql`
    fragment authTicketResponse on AuthenticationTicket{
        accessToken
        user {
            ...userPayload
        }
    }
`

export const LOGIN_RESPONSE_FRAGMENT = gql`
    fragment loginResponse on LoginResult {
        status
        ticket{
            ...authTicketResponse
        }
    }
`;
