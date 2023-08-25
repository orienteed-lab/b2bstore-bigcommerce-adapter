import { gql } from '@apollo/client';


export const GET_ENTITY_ID_BY_SKU = gql`
query entityIdBySku($variantSku: String) {
    site {
        product(sku: $variantSku) {
            name
            entityId
        }
    }
}
`;

export const GET_PARENT_SKU_BY_SKU = gql`
query productBySku($entityId: Int) {
    site {
        product(entityId: $entityId) {
            sku
            id
        }
    }
}
`;

export default {
    getEntityIdBySkuQuery: GET_ENTITY_ID_BY_SKU,
    getParentSkuBySkuQuery: GET_PARENT_SKU_BY_SKU
};
