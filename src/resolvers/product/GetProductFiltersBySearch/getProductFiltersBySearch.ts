import { ClientProps } from 'src';
import { GetProductFiltersBySearchQueryVariables } from '@schema';
import { getProductFiltersBySearchParser } from './getProductFiltersBySearchParser';
import DEFAULT_OPERATIONS from './getProductFiltersBySearch.gql';

const GetProductFiltersBySearch = (clientProps: ClientProps) => (resolverProps: GetProductFiltersBySearchQueryVariables) => {
    const { mergeOperations, useLazyQuery } = clientProps;
    const { search } = resolverProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getProductFiltersBySearchQuery } = operations;

    let parsedData = undefined;

    const [getFilters, { data, error, loading }] = useLazyQuery(getProductFiltersBySearchQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        }
    });

    if (data) {
        parsedData = getProductFiltersBySearchParser(data);
    }

    return { data: parsedData, loading, error, getFilters };
};

export default GetProductFiltersBySearch;
