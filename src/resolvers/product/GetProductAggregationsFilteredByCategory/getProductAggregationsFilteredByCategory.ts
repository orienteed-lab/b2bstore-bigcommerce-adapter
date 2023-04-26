import { ClientProps } from 'src';
import { GetProductAggregationsFilteredByCategoryQueryVariables } from '@schema';

import { getProductAggregationsFilteredByCategoryParser } from './getProductAggregationsFilteredByCategoryParser';
import DEFAULT_OPERATIONS from './getProductAggregationsFilteredByCategory.gql';
import { useEffect, useState } from 'react';

const GetProductAggregationsFilteredByCategory =
    (clientProps: ClientProps) => (resolverProps: GetProductAggregationsFilteredByCategoryQueryVariables) => {
        const { useLazyQuery, mergeOperations } = clientProps;
        const { categoryIdFilter } = resolverProps;
        const filterId = categoryIdFilter ? Number(categoryIdFilter.eq) : null;

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getProductAggregationsFilteredByCategoryQuery } = operations;

        const [getFilters, { data, loading, error }] = useLazyQuery(getProductAggregationsFilteredByCategoryQuery, {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        });
        const [parsedData, setParsedData] = useState(undefined);

        useEffect(() => {
            if (categoryIdFilter) {
                getFilters({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    },
                    variables: {
                        category: {
                            categoryEntityIds: filterId
                        }
                    }
                });
                console.log('Antes del parser', data);

                if (data) {
                    // try {
                    setParsedData(getProductAggregationsFilteredByCategoryParser(data));
                    // } catch (e) {
                    //     console.error(e);
                    // }
                }

                console.log('Después del parser', parsedData);
            }
        },[categoryIdFilter]);

        return { data: parsedData, loading, error };
    };

export default GetProductAggregationsFilteredByCategory;
