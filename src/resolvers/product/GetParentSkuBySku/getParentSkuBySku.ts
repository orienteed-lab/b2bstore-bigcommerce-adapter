import { ClientProps } from 'src';
import { GetParentSkuBySkuQueryVariables } from '@schema';

import { getParentSkuBySkuParser } from './getParentSkuBySkuParser';
import DEFAULT_OPERATIONS from './getParentSkuBySku.gql'

const GetParentSkuBySku = (clientProps: ClientProps) => (resolverProps: GetParentSkuBySkuQueryVariables) => {
    const { mergeOperations, useAwaitQuery } = clientProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getEntityIdBySkuQuery, getParentSkuBySkuQuery } = operations;

    const getEntityId = useAwaitQuery(getEntityIdBySkuQuery);
    const getParentSkuBySku = useAwaitQuery(getParentSkuBySkuQuery);

    const getParentSku = async ({variables}) => {
        let parsedData = undefined;
        const dataEntityId = await getEntityId({
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            },
            variables: {
                variantSku: variables.sku
            }
        });

        const dataParentSKU = await getParentSkuBySku({
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            },
            variables: {
                entityId: dataEntityId.data.site.product.entityId
            }
        });

        try {
            parsedData = getParentSkuBySkuParser(dataParentSKU.data);
        } catch (e) {
            console.error(e);
        }

        return { data: parsedData }
    }

    return { getParentSku };
};

export default GetParentSkuBySku;
