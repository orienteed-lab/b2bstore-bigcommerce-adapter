import { gql } from '@apollo/client';

export const SIGN_IN = gql`
    mutation SignIn($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            customer {
                entityId
            }
        }
    }
`;

export default {
    signInMutation: SIGN_IN
};