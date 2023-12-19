import { gql } from '@apollo/client';

export const GET_PRODUCT_AND_VARIANT_IDS = gql`
    query getProductAndVariantIds($sku:String) {
        site {
            product(sku:$sku) {
                entityId
                sku
                name
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
                            options {
                                edges {
                                    node {
                                        values {
                                            edges {
                                                node {
                                                    label
                                                }
                                            }
                                        }
                                    }
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
