import { ClientProps } from 'src';
import { GetProductFiltersBySearchQueryVariables } from '@schema';
import { getProductFiltersBySearchParser } from './getProductFiltersBySearchParser';
import DEFAULT_OPERATIONS from './getProductFiltersBySearch.gql';
import { useCallback, useState } from 'react';

const GetProductFiltersBySearch = (clientProps: ClientProps) => (resolverProps: GetProductFiltersBySearchQueryVariables) => {
    const { mergeOperations, useAwaitQuery } = clientProps;
    const [data, setData] = useState(undefined);

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getProductFiltersBySearchQuery } = operations;
    const getFilter = useAwaitQuery(getProductFiltersBySearchQuery);

    const getFilters = async ({ variables }) => {
        const { data: filterData } = await getFilter({
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            },
            variables: {
                search: {
                    searchTerm: variables.search
                }
            }
        });

        setData(getProductFiltersBySearchParser(filterData));
    };

    return { data, getFilters };
};

export default GetProductFiltersBySearch;
