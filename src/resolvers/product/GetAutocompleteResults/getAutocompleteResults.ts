import { ClientProps } from 'src';
import { GetAutocompleteResultsQueryVariables } from '@schema';

import { getAutocompleteResultsParser } from './getAutocompleteResultsParser';
import DEFAULT_OPERATIONS from './getAutocompleteResults.gql';

const GetAutocompleteResults = (clientProps: ClientProps) => (resolverProps: GetAutocompleteResultsQueryVariables) => {
    const { mergeOperations, useLazyQuery } = clientProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getAutocompleteResultsQuery } = operations;

    const [runSearch, productResult] = useLazyQuery(getAutocompleteResultsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        }
    });

    const { data } = productResult;

    let parsedData = undefined;

    if (data) {
        parsedData = getAutocompleteResultsParser(data);
    }

    return { productResult: { data: parsedData }, runSearch };
};

export default GetAutocompleteResults;
