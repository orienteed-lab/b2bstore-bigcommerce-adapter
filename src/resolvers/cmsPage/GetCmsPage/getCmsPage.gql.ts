import { gql } from '@apollo/client';

export const GET_CMS_PAGE = gql`
    query GetCmsPage ($identifier: Int!){
        site{
            content{
                page(entityId:$identifier){
                    __typename
                    entityId
                    name
                    seo{
                        pageTitle
                        metaDescription
                        metaKeywords
                    }
                    ... on NormalPage{
                        htmlBody
                    }
                }
            }
        }
}
`;

export default {
    getCmsPageQuery: GET_CMS_PAGE
};
