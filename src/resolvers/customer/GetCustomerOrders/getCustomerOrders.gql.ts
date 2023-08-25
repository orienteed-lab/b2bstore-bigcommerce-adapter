import { gql } from '@apollo/client';

export const GET_CUSTOMER_ID = gql`
    query getCustomerId {
        customer {
            entityId
        }
    }
`;

export const GET_PRODUCT_PATH = gql`
    query getProductPath($id: Int) {
        site {
            product(entityId: $id) {
                path
            }
        }
    }
`;

export default {
    getCustomerIdQuery: GET_CUSTOMER_ID,
    getProductPathQuery: GET_PRODUCT_PATH
};
