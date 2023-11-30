import { ClientProps } from 'src';
import { GetProductItemsFilteredByCategoryQueryVariables } from '@schema';

import { getProductItemsFilteredByCategoryParser } from './getProductItemsFilteredByCategoryParser';
import DEFAULT_OPERATIONS from './getProductItemsFilteredByCategory.gql';
import { useCallback, useState } from 'react';

const GetProductItemsFilteredByCategory =
    (clientProps: ClientProps) => (resolverProps: GetProductItemsFilteredByCategoryQueryVariables) => {
        const { mergeOperations, useAwaitQuery } = clientProps;
        const [data, setData] = useState(undefined);

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getProductItemsFilteredByCategoryQuery } = operations;

        const getProducts = useAwaitQuery(getProductItemsFilteredByCategoryQuery);

        const getFilters = async ({variables}) => {
            const { data: product } = await getProducts({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    category: parseInt(variables.categoryIdFilter.eq)
                }
            });
            setData(getProductItemsFilteredByCategoryParser(product));
        };

        return { getFilters, data };
    };

export default GetProductItemsFilteredByCategory;
