import { gql } from '@apollo/client';

export const GET_BREADCRUMBS = gql`
   query getBreadcrumbs($id:Int!) {
    site {
        category(entityId:$id) {
            id
            entityId
            name
            path
            breadcrumbs(depth:10) {
                edges {
                    node {
                        category_uid: entityId
                        name
                        
                    }
                }
            }
        }
    }
}
`;

export default {
    getBreadcrumbsQuery: GET_BREADCRUMBS
};
