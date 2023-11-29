import { gql } from '@apollo/client';

export const GET_ROUTE_DATA = gql`
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
    getRouteDataQuery: GET_ROUTE_DATA
};
