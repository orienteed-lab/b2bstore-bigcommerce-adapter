import { gql } from '@apollo/client';

export const GET_SIMPLE_PRODUCT = gql`
    query getSimpleProduct($productSku: String) {
        site {
            product(sku: $productSku) {
                name
                sku
                entityId
                id
                inventory {
                    isInStock
                }
                images {
                    edges {
                        node {
                            urlOriginal
                            altText
                            isDefault
                        }
                    }
                }
                productOptions {
                    edges {
                        node {
                            displayName
                            ... on MultipleChoiceOption {
                                values {
                                    edges {
                                        node {
                                            label
                                            isSelected
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                categories {
                    edges {
                        node {
                            id
                            path
                        }
                    }
                }
                description
                defaultImage {
                    altText
                    urlOriginal
                }
                prices(includeTax: true) {
                    price {
                        value
                        currencyCode
                    }
                    priceRange {
                        min {
                            value
                            currencyCode
                        }
                        max {
                            value
                            currencyCode
                        }
                    }
                }
            }
        }
    }
`;

export default {
    getSimpleProductQuery: GET_SIMPLE_PRODUCT
};
