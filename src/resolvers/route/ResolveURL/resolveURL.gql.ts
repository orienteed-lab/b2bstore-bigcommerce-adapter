import { gql } from '@apollo/client';

export const RESOLVE_URL = gql`
    query resolveURL($path: String!) {
        site {
            route(path: $path) {
                node {
                    ... on Category {
                        name
                        path
                        entityId
                    }
                    ... on Product {
                        name
                        entityId
                        path
                        productOptions {
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
`;

export default {
    resolveUrlQuery: RESOLVE_URL
};
