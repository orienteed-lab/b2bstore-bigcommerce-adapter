import { gql } from '@apollo/client';

export const GET_CUSTOMER_ADDRESSES = gql`
    query getCustomerId {
        customer {
            entityId
        }
    }
`;

export default {
    getCustomerAddressesForAddressBookQuery: GET_CUSTOMER_ADDRESSES
};
