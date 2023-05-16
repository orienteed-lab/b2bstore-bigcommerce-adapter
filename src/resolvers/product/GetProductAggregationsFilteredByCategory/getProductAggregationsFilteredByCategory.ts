import { ClientProps } from 'src';
import { GetProductAggregationsFilteredByCategoryQueryVariables } from '@schema';

import { getProductAggregationsFilteredByCategoryParser } from './getProductAggregationsFilteredByCategoryParser';
import DEFAULT_OPERATIONS from './getProductAggregationsFilteredByCategory.gql';

const GetProductAggregationsFilteredByCategory =
    (clientProps: ClientProps) => (resolverProps: GetProductAggregationsFilteredByCategoryQueryVariables) => {
        const { useLazyQuery, mergeOperations } = clientProps;

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getProductAggregationsFilteredByCategoryQuery } = operations;

        const [getFilters, { data }] = useLazyQuery(getProductAggregationsFilteredByCategoryQuery, {
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
            try {
            parsedData = getProductAggregationsFilteredByCategoryParser(data);
            } catch (e) {
                console.error(e);
            }
        }

        return { getFilters, data: parsedData };
    };

export default GetProductAggregationsFilteredByCategory;
