import { gql } from '@apollo/client';

export const GET_PRODUCT_ID_WITH_SKU = gql`
    query getProductIdWithSKU($sku:String) {
    site {
        product(sku:$sku) {
            entityId
        }
    }
}
`;

export default {
    getProductIdWithSkuQuery: GET_PRODUCT_ID_WITH_SKU
};
