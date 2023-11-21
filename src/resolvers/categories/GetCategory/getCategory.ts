import { ClientProps } from 'src';
import { GetCategoryQueryVariables } from '@schema';

import { getCategoryParser } from './getCategoryParser';
import DEFAULT_OPERATIONS from './getCategory.gql';
import { useCallback, useState } from 'react';

const GetCategory =
    (clientProps: ClientProps) =>
    (resolverProps: GetCategoryQueryVariables = { currentPage: 1, filters: { sku: { eq: '' } }, id: '', pageSize: 20 }) => {
        const { mergeOperations, useAwaitQuery } = clientProps;
        const [data, setData] = useState(undefined);
        const [called, setCalled] = useState(false);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(undefined);

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getCategoryQuery } = operations;

        const getCategory = useAwaitQuery(getCategoryQuery);

        const sortReference = (sort) => {
            if (sort.name != undefined) {
                return sort.name === 'ASC' ? 'A_TO_Z' : 'Z_TO_A';
            } else if (sort.price != undefined) {
                return sort.price === 'ASC' ? 'LOWEST_PRICE' : 'HIGHEST_PRICE';
            } else if (sort.relevance != undefined) {
                return sort.relevance === 'DESC' ? 'RELEVANCE' : 'FEATURED';
            } else {
                return 'FEATURED';
            }
        };

        const getFilters = (filterData) => {
            const keys = Object.keys(filterData);
            const productAttributes = [];

            keys.map((key) => (key !== 'category_uid' ? productAttributes.push({
                attribute: key,
                values: filterData[key].eq ? [filterData[key].eq] : filterData[key].in
            }) : null));

            return productAttributes;
        };

        const runQuery = useCallback(async ({ variables }) => {
            setLoading(true);
            setCalled(true);
            try {
                console.log(variables.filters);
                const { data: categoryData } = await getCategory({
                    //TODO_B2B: Only showing the first 50 products
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    },
                    variables: {
                        id: parseInt(variables.id),
                        filters: { categoryEntityId: parseInt(variables.filters.category_uid.eq),
                        productAttributes: getFilters(variables.filters) },
                        sort: sortReference(variables.sort)
                    }
                });
                setData(getCategoryParser(categoryData, variables.currentPage, variables.pageSize));
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        }, []);

        return { runQuery, called, loading, data, error };
    };

export default GetCategory;
