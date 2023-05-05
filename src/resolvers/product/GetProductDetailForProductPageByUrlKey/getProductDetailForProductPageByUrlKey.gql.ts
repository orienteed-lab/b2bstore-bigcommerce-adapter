import { gql } from '@apollo/client';

export const GET_PRODUCT_DETAIL_FOR_PRODUCT_PAGE_BY_URL_KEY = gql`
    query GetProductDetailForProductPageByUrlKey($urlPath: String!) {
        site {
            route(path: $urlPath) {
                node {
                    __typename
                    id

                    ... on Product {
                        id
                        entityId
                        name
                        sku
                        description
                        inventory {
                            isInStock
                        }
                        reviewSummary {
                            summationOfRatings
                        }
                        type
                        path
                        categories {
                            edges {
                                node {
                                    id
                                    entityId
                                }
                            }
                        }
                        productOptions {
                            edges {
                                node {
                                    __typename
                                    displayName
                                    entityId
                                    isRequired
                                    isVariantOption
                                    ... on MultipleChoiceOption {
                                        entityId
                                        displayName
                                        values {
                                            edges {
                                                node {
                                                    entityId
                                                    label
                                                    isDefault
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        variants {
                            edges {
                                node {
                                    sku
                                    entityId
                                    id
                                    defaultImage {
                                        urlOriginal
                                    }
                                    options {
                                        edges {
                                            node {
                                                displayName
                                                values {
                                                    edges {
                                                        node {
                                                            entityId
                                                            label
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    inventory {
                                        isInStock
                                    }
                                    upc
                                    prices {
                                        price {
                                            currencyCode
                                            value
                                        }
                                        priceRange {
                                            min {
                                                currencyCode
                                                value
                                            }
                                            max {
                                                currencyCode
                                                value
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        customFields {
                            edges {
                                node {
                                    name
                                    value
                                }
                            }
                        }
                        prices {
                            price {
                                currencyCode
                                value
                            }
                            priceRange {
                                min {
                                    currencyCode
                                    value
                                }
                                max {
                                    currencyCode
                                    value
                                }
                            }
                        }
                        images {
                            edges {
                                node {
                                    urlOriginal
                                    altText
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
    getProductDetailForProductPageByUrlKeyQuery: GET_PRODUCT_DETAIL_FOR_PRODUCT_PAGE_BY_URL_KEY
};