import { ClientProps } from 'src';
import { GetAvailableSortMethodsBySearchQueryVariables } from '@schema';

import { getAvailableSortMethodsBySearchParser } from './getAvailableSortMethodsBySearchParser';
import DEFAULT_OPERATIONS from './getAvailableSortMethodsBySearch.gql';
import { useState } from 'react';

const GetAvailableSortMethodsBySearch = (clientProps: ClientProps) => (resolverProps: GetAvailableSortMethodsBySearchQueryVariables) => {
    const { mergeOperations, useAwaitQuery } = clientProps;
    const [data, setData] = useState(undefined);

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getAvailableSortMethodsBySearchQuery } = operations;
    const getSorts = useAwaitQuery(getAvailableSortMethodsBySearchQuery);

    const getSortMethods = async ({ variables }) => {
        const { data: sortData } = await getSorts({
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

        setData(getAvailableSortMethodsBySearchParser(sortData));
    };

    return { data, getSortMethods };
};

export default GetAvailableSortMethodsBySearch;
