import { ClientProps } from 'src';
import { GetProductAggregationsFilteredByCategoryQueryVariables } from '@schema';

import { getProductAggregationsFilteredByCategoryParser } from './getProductAggregationsFilteredByCategoryParser';
import DEFAULT_OPERATIONS from './getProductAggregationsFilteredByCategory.gql';
import { useState } from 'react';

const GetProductAggregationsFilteredByCategory =
    (clientProps: ClientProps) => (resolverProps: GetProductAggregationsFilteredByCategoryQueryVariables) => {
        const { useAwaitQuery, mergeOperations } = clientProps;
        const [data, setData] = useState(null);

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getProductAggregationsFilteredByCategoryQuery } = operations;
        const getAggregations = useAwaitQuery(getProductAggregationsFilteredByCategoryQuery);

        const getFilters = async ({variables}) => {
            const { data: filterData } = await getAggregations({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    category: {categoryEntityId: parseInt(variables.categoryIdFilter.eq)}
                }
            });

            setData(getProductAggregationsFilteredByCategoryParser(filterData));
        };

        return { getFilters, data};
    };

export default GetProductAggregationsFilteredByCategory;
