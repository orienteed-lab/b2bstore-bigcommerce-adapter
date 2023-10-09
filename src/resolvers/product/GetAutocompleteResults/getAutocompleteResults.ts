import { ClientProps } from 'src';
import { GetAutocompleteResultsQueryVariables } from '@schema';

import { getAutocompleteResultsParser } from './getAutocompleteResultsParser';
import DEFAULT_OPERATIONS from './getAutocompleteResults.gql';
import { useState } from 'react';

interface GetAutocompleteResultsProps extends GetAutocompleteResultsQueryVariables {
    hasVars: boolean
}

const GetAutocompleteResults = (clientProps: ClientProps) => (resolverProps: GetAutocompleteResultsProps = {inputText: null, hasVars: false}) => {
    const { mergeOperations, useAwaitQuery } = clientProps;
    const { inputText } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getAutocompleteResultsQuery } = operations;
    const getResults = useAwaitQuery(getAutocompleteResultsQuery);

    const runSearch = async ({variables}) => {
        setLoading(true);
        try {
            const { data: resultData } = await getResults({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    search: {
                        searchTerm: variables.inputText || inputText
                    }
                }
            });

            setData(getAutocompleteResultsParser(resultData));
        } catch (err) {
            setError(err);
        };
        setLoading(true);
    }

    return { productResult: { data, loading, error }, runSearch };
};

export default GetAutocompleteResults;
