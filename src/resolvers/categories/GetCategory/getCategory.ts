import { ClientProps } from 'src';
import { GetCategoryQueryVariables } from '@schema';

import { getCategoryParser } from './getCategoryParser';
import DEFAULT_OPERATIONS from './getCategory.gql';

const GetCategory = (clientProps: ClientProps) => (resolverProps: GetCategoryQueryVariables) => {
    const { mergeOperations, useLazyQuery } = clientProps;
    const { pageSize, currentPage } = resolverProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getCategoryQuery } = operations;

    const sortReference = {
        'name:asc': 'A_TO_Z',
        'name:desc': 'Z_TO_A',
        'price:asc': 'LOW_TO_HIGH',
        'price:desc': 'HIGH_TO_LOW',
        'relevance:desc': 'RELEVANCE',
        'position:asc': 'FEATURED'
    };

    const [runQuery, queryResponse] = useLazyQuery(getCategoryQuery, {
        //TODO_B2B: Only showing the first 50 products
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { called, loading, error, data } = queryResponse;

    let parsedData = undefined;

    if (data) {
        // try {
        parsedData = getCategoryParser(data, currentPage, pageSize);
        // } catch (e) {
        //     console.error(e);
        // }
    }

    return { runQuery, queryResponse: { called, loading, data: parsedData, error } };
};

export default GetCategory;
