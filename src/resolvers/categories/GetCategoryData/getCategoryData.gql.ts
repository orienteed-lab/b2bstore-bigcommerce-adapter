import { gql } from '@apollo/client';

export const GET_CATEGORY_DATA = gql`
    query getCategoryData($id: Int!) {
        site {
            categoryTree(rootEntityId: $id) {
                entityId
                name
                description
                path
                children {
                    entityId
                    name
                    description
                    productCount
                    path
                    image {
                        urlOriginal
                    }
                    children {
                        entityId
                    }
                }
            }
            search {
                searchProducts(filters: { categoryEntityId: $id }) {
                    products {
                        edges {
                            node {
                                entityId
                                images {
                                    edges {
                                        node {
                                            urlOriginal
                                        }
                                    }
                                }
                                categories {
                                    edges {
                                        node {
                                            entityId
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
    getCategoryDataQuery: GET_CATEGORY_DATA
};
