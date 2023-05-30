import { ClientProps } from 'src';
import { GetAvailableSortMethodsBySearchQueryVariables } from '@schema';

import { getAvailableSortMethodsBySearchParser } from './getAvailableSortMethodsBySearchParser';
import DEFAULT_OPERATIONS from './getAvailableSortMethodsBySearch.gql';

const GetAvailableSortMethodsBySearch = (clientProps: ClientProps) => (resolverProps: GetAvailableSortMethodsBySearchQueryVariables) => {
    const { mergeOperations, useLazyQuery } = clientProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getAvailableSortMethodsBySearchQuery } = operations;

    const [getSortMethods, { data }] = useLazyQuery(getAvailableSortMethodsBySearchQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        }
    });

    let parsedData = undefined;

    if (data) {
        parsedData = getAvailableSortMethodsBySearchParser(data);
    }

    return { data: parsedData, getSortMethods };
};

export default GetAvailableSortMethodsBySearch;
