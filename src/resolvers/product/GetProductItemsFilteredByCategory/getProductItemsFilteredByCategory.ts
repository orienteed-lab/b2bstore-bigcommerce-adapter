import { ClientProps } from 'src';
import { GetProductItemsFilteredByCategoryQueryVariables } from '@schema';

import { getProductItemsFilteredByCategoryParser } from './getProductItemsFilteredByCategoryParser';
import DEFAULT_OPERATIONS from './getProductItemsFilteredByCategory.gql';

const GetProductItemsFilteredByCategory =
    (clientProps: ClientProps) => (resolverProps: GetProductItemsFilteredByCategoryQueryVariables) => {
        const { useLazyQuery, mergeOperations } = clientProps;

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getProductItemsFilteredByCategoryQuery } = operations;

        const [getFilters, { data }] = useLazyQuery(getProductItemsFilteredByCategoryQuery, {
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
                parsedData = getProductItemsFilteredByCategoryParser(data);
            } catch (e) {
                console.error(e);
            }
        }

        return { getFilters, data: parsedData };
    };

export default GetProductItemsFilteredByCategory;
