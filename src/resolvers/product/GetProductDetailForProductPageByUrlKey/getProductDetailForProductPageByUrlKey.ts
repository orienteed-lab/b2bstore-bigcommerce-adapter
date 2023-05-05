import { ClientProps } from 'src';
import { GetProductDetailForProductPageByUrlKeyQueryVariables } from '@schema';

import { getProductDetailForProductPageByUrlKeyParser } from './getProductDetailForProductPageByUrlKeyParser';
import DEFAULT_OPERATIONS from './getProductDetailForProductPageByUrlKey.gql';

const GetProductDetailForProductPageByUrlKey = (clientProps: ClientProps) => (
    resolverProps: GetProductDetailForProductPageByUrlKeyQueryVariables
) => {
    const { useQuery, mergeOperations } = clientProps;
    const { urlKey } = resolverProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getProductDetailForProductPageByUrlKeyQuery } = operations;

    const { data, loading, error, refetch } = useQuery(getProductDetailForProductPageByUrlKeyQuery, {
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        },
        variables: {
            urlPath: urlKey
        }
    });

    //console.log('antes del parser', data);

    let parsedData = undefined;
    if (data) {
        // try {
        parsedData = getProductDetailForProductPageByUrlKeyParser(data);
        // } catch (e) {
        //     console.error(e);
        // }
    }

    //console.log('despues del parser', parsedData);

    return { data: parsedData, loading, error, refetch };
    // return { data, loading, error, refetch };
};

export default GetProductDetailForProductPageByUrlKey;
