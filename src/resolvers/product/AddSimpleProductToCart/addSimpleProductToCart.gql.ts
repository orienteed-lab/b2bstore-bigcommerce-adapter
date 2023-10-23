import { gql } from '@apollo/client';

export const GET_PRODUCT_ID_WITH_SKU = gql`
    query getProductIdWithSKU($sku:String) {
    site {
        product(sku:$sku) {
            entityId
            variants {
                edges {
                    node {
                        entityId
                        sku
                    }
                }
            }
        }
    }
}
`;

export default {
    getProductIdWithSkuQuery: GET_PRODUCT_ID_WITH_SKU
};
