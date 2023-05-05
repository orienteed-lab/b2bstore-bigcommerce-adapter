import { ClientProps } from 'src';
import { GetProductItemsFilteredByCategoryQueryVariables } from '@schema';

import { getProductItemsFilteredByCategoryParser } from './getProductItemsFilteredByCategoryParser';
import DEFAULT_OPERATIONS from './getProductItemsFilteredByCategory.gql';

const GetProductItemsFilteredByCategory =
    (clientProps: ClientProps) => (resolverProps: GetProductItemsFilteredByCategoryQueryVariables) => {
        const { useQuery, mergeOperations } = clientProps;
        const { categoryIdFilter } = resolverProps;

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getProductItemsFilteredByCategoryQuery } = operations;

        let parsedData = undefined;

        const { data, loading, error } = useQuery(getProductItemsFilteredByCategoryQuery, {
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            },
            variables: {
                category: categoryIdFilter
            }
        });

        //console.log('antes del parser', data);

        if (data) {
            // try {
            parsedData = getProductItemsFilteredByCategoryParser(data);
            // } catch (e) {
            //     console.error(e);
            // }
        }
        //console.log('despues del parser', parsedData);
        return { data: parsedData, loading, error };
        //return { data, loading, error };
    };

export default GetProductItemsFilteredByCategory;
