import { gql } from '@apollo/client';

export const GET_AVAILABLE_SORT_METHODS_BY_SEARCH = gql`
    query getCategoryIdOfProductSearch($search: SearchProductsFiltersInput!) {
        site {
            search {
                searchProducts(filters: $search) {
                    products {
                        edges {
                            node {
                                entityId
                                categories(first: 1) {
                                    edges {
                                        node {
                                            entityId
                                        }
                                    }
                                }
                            }
                        }
                    }
                    filters {
                        edges {
                            node {
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default {
    getAvailableSortMethodsBySearchQuery: GET_AVAILABLE_SORT_METHODS_BY_SEARCH
};
