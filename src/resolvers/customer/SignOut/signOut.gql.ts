import { gql } from '@apollo/client';

export const SIGN_OUT = gql`
    mutation signOut {
        logout {
            result
        }
    }
`;

export default {
    signOutMutation: SIGN_OUT
};
