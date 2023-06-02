import { ClientProps } from 'src';
import { GetProductDetailForConfigurableOptionsBySkuQueryVariables } from '@schema';

import { getProductDetailForConfigurableOptionsBySkuParser } from './getProductDetailForConfigurableOptionsBySkuParser';
import DEFAULT_OPERATIONS from './getProductDetailForConfigurableOptionsBySku.gql';

interface ProductLazy extends GetProductDetailForConfigurableOptionsBySkuQueryVariables {
    lazy: boolean;
}
const GetProductDetailForConfigurableOptionsBySku = (clientProps: ClientProps) => (resolverProps: ProductLazy) => {
    const { useQuery, mergeOperations, useLazyQuery, restClient } = clientProps;
    const { lazy, sku } = resolverProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getProductDetailForConfigurableOptionsBySkuQuery } = operations;

    let parsedData = undefined;

    if (lazy) {
        const [runQuery, queryResult] = useLazyQuery(getProductDetailForConfigurableOptionsBySkuQuery, {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            }
        });
        const { data } = queryResult;
        
        if (data) {
            parsedData = getProductDetailForConfigurableOptionsBySkuParser(data);
        }
       
        return { queryResult: { data: parsedData }, runQuery };
    } else {
        const { loading, error, data } = useQuery(getProductDetailForConfigurableOptionsBySkuQuery, {
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            },
            variables: {
                sku: "SLLPJ-6088C959"
            }
        });
    
        if (data) {
            parsedData = getProductDetailForConfigurableOptionsBySkuParser(data);

        }

        return { data: parsedData, loading, error };
    }
};
export default GetProductDetailForConfigurableOptionsBySku;
