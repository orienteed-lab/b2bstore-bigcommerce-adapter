import { ClientProps } from 'src';
import { GetProductDetailForQuickOrderBySkuQueryVariables } from '@schema';

import { getProductDetailForQuickOrderBySkuParser } from './getProductDetailForQuickOrderBySkuParser';
import DEFAULT_OPERATIONS from './getProductDetailForQuickOrderBySku.gql';

const GetProductDetailForQuickOrderBySku =
    (clientProps: ClientProps) => async (resolverProps: GetProductDetailForQuickOrderBySkuQueryVariables) => {
        const { useAwaitQuery, mergeOperations } = clientProps;
        const { sku } = resolverProps;

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getProductDetailForQuickOrderBySkuQuery } = operations;

        const getProduct = useAwaitQuery(getProductDetailForQuickOrderBySkuQuery);
        const data = await getProduct({
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            },
            variables: {
                sku: sku
            }
        });

        let parsedData = undefined;

        if (data) {
            // try {
            parsedData = getProductDetailForQuickOrderBySkuParser(data.data);
            // } catch (e) {
            //     console.error(e);
            // }
        }

        return { data: { data: parsedData, loading: data.loading, networkStatus: data.networkStatus } };
    };

export default GetProductDetailForQuickOrderBySku;
