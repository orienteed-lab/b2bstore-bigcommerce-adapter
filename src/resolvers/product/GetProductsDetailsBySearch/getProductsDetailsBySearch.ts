import { ClientProps } from 'src';
import { GetProductsDetailsBySearchQueryVariables } from '@schema';

import { getProductsDetailsBySearchParser } from './getProductsDetailsBySearchParser';
import DEFAULT_OPERATIONS from './getProductsDetailsBySearch.gql';

const GetProductsDetailsBySearch = (clientProps: ClientProps) => (resolverProps: GetProductsDetailsBySearchQueryVariables) => {
    const { mergeOperations, useLazyQuery } = clientProps;
    const { pageSize } = resolverProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getProductsDetailsBySearchQuery } = operations;

    const [runQuery, { called, loading, error, data }] = useLazyQuery(
        getProductsDetailsBySearchQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            }
        }
    );

    let parsedData = undefined;

    if (data) {
        try {
        parsedData = getProductsDetailsBySearchParser(data, pageSize); //TODO_B2B: Check how to use currentPage var
        } catch (e) {
            console.error(e);
        }
    }

    return { runQuery, called, data: parsedData, loading, error };

};

export default GetProductsDetailsBySearch;
