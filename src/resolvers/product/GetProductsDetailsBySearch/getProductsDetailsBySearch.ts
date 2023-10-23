import { ClientProps } from 'src';
import { GetProductsDetailsBySearchQueryVariables } from '@schema';

import { getProductsDetailsBySearchParser } from './getProductsDetailsBySearchParser';
import DEFAULT_OPERATIONS from './getProductsDetailsBySearch.gql';
import { useCallback, useState } from 'react';

const GetProductsDetailsBySearch = (clientProps: ClientProps) => (resolverProps: GetProductsDetailsBySearchQueryVariables) => {
    const { mergeOperations, useLazyQuery, useAwaitQuery } = clientProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const [called, setCalled] = useState(false);

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getProductsDetailsBySearchQuery } = operations;
    const getProducts = useAwaitQuery(getProductsDetailsBySearchQuery);

    const sortReference = (sort) => {
        if (sort.name != undefined) {
            return sort.name === 'ASC' ? 'A_TO_Z' : 'Z_TO_A';
        } else if (sort.price != undefined) {
            return sort.price === 'ASC' ? 'LOW_TO_HIGH' : 'HISH_TO_LOW';
        } else if (sort.relevance != undefined) {
            return sort.relevance === 'DESC' ? 'RELEVANCE' : 'FEATURED';
        } else {
            return 'FEATURED';
        }
    };

    const getFilters = (searchTerm, filterData) => {
        const productAttributes = [];
        let categoryEntityIds = [];
        let categoryEntityId = null;

        for (const key in filterData) {
            key === 'category_id'
                ? filterData[key].eq
                    ? (categoryEntityId = parseInt(filterData[key].eq))
                    : (categoryEntityIds = filterData[key].in.map((value) => parseInt(value)))
                : productAttributes.push({
                      attribute: key,
                      values: filterData[key].eq ? [filterData[key].eq] : filterData[key].in
                  });
        }

        return categoryEntityId
            ? {
                  searchTerm,
                  categoryEntityId,
                  productAttributes
              }
            : categoryEntityIds.length !== 0
            ? {
                  searchTerm,
                  categoryEntityIds,
                  productAttributes
              }
            : {
                  searchTerm,
                  productAttributes
              };
    };

    const runQuery = useCallback(async ({ variables }) => {
        setLoading(true);
        setCalled(true);
        console.log(variables.filters);
        try {
            const { data: productData } = await getProducts({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    filters: getFilters(variables.inputText, variables.filters),
                    sort: sortReference(variables.sort)
                }
            });

            setData(getProductsDetailsBySearchParser(productData, variables.pageSize));
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    }, []);

    // const runQuery = async ({ variables }) => {
    //     setLoading(true);
    //     setCalled(true);
    //     console.log(variables.filters);
    //     try {
    //         const { data: productData } = await getProducts({
    //             context: {
    //                 headers: {
    //                     backendTechnology: ['bigcommerce']
    //                 }
    //             },
    //             variables: {
    //                 filters: getFilters(variables.inputText, variables.filters),
    //                 sort: sortReference(variables.sort)
    //             }
    //         });

    //         setData(getProductsDetailsBySearchParser(productData, variables.pageSize));
    //     } catch (err) {
    //         setError(err);
    //     }
    //     setLoading(false);
    // };

    return { runQuery, called, data, loading, error };
};

export default GetProductsDetailsBySearch;
