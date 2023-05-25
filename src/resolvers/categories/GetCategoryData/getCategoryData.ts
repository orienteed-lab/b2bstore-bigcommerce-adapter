import { ClientProps } from 'src';
import { GetCategoryDataQueryVariables } from '@schema';
import { getCategoryDataParser } from './getCategoryDataParser';
import DEFAULT_OPERATIONS from './getCategoryData.gql';

import { useEffect, useState } from 'react';

interface CategoryLazy extends GetCategoryDataQueryVariables {
    lazy: boolean;
}

const GetCategoryData = (clientProps: ClientProps) => (resolverProps: CategoryLazy) => {
    const { useQuery, mergeOperations, useLazyQuery, restClient } = clientProps;
    const { lazy, id } = resolverProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getCategoryDataQuery } = operations;

    let parsedData = undefined;

    if (lazy) {
        const [runQuery, queryResult] = useLazyQuery(getCategoryDataQuery, {
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
            parsedData = getCategoryDataParser(data);
        }

        return { queryResult: { data: parsedData }, runQuery };
    } else {
        const { loading, error, data } = useQuery(getCategoryDataQuery, {
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            },
            variables: {
                id: 21
            }
        });

        if (data) {
            parsedData = getCategoryDataParser(data);
        }

        return { data: parsedData, loading, error };
    }
};

export default GetCategoryData;
