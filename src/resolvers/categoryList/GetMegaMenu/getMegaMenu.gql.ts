import { gql } from '@apollo/client';

export const GET_MEGA_MENU = gql`
    query CategoryTree3LevelsDeep {
        site {
            categoryTree {
                ...CategoryFields
                children {
                    ...CategoryFields
                    children {
                        ...CategoryFields
                        children {
                            ...CategoryFields
                        }
                    }
                }
            }
        }
    }

    fragment CategoryFields on CategoryTreeItem {
        entityId
        name
        image {
            urlOriginal
        }
        path
    }
`;

export default {
    getMegaMenuQuery: GET_MEGA_MENU
};
