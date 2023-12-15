import { gql } from '@apollo/client';

export const GET_PRODUCT_AND_VARIANT_IDS = gql`
    query getProductAndVariantIds($sku:String) {
        site {
            product(sku:$sku) {
                entityId
                sku
                variants {
                    edges {
                        node {
                            entityId
                            sku
                            prices {
                                price {
                                    value
                                }
                                basePrice {
                                    value
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default {
    getProductAndVariantIdsQuery: GET_PRODUCT_AND_VARIANT_IDS
};
