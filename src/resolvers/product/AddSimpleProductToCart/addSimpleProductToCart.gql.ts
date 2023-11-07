import { gql } from '@apollo/client';

export const GET_PRODUCT_ID_WITH_SKU = gql`
#  Write a query that allows you to get the entityId of a product providing the sku
`;

export default {
    getProductIdWithSkuQuery: GET_PRODUCT_ID_WITH_SKU
};
