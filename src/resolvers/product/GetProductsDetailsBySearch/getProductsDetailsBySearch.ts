import { ClientProps } from 'src';
import { GetProductsDetailsBySearchQueryVariables } from '@schema';
import { useEffect } from 'react';

import { getProductsDetailsBySearchParser } from './getProductsDetailsBySearchParser';
import DEFAULT_OPERATIONS from './getProductsDetailsBySearch.gql';

const GetProductsDetailsBySearch = (clientProps: ClientProps) => (resolverProps: GetProductsDetailsBySearchQueryVariables) => {
    const { useQuery, mergeOperations, useLazyQuery } = clientProps;
    const { inputText, pageSize, currentPage, filters, sort } = resolverProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getProductsDetailsBySearchQuery } = operations;

    // const sortReference = {
    //     'name:asc': 'A_TO_Z',
    //     'name:desc': 'Z_TO_A',
    //     'price:asc': 'LOW_TO_HIGH',
    //     'price:desc': 'HIGH_TO_LOW',
    // }

    // const [runQuery, queryResponse] = useLazyQuery(getProductsDetailsBySearchQuery, {
    //     fetchPolicy: 'cache-and-network',
    //     nextFetchPolicy: 'cache-first'
    // });

    // const { called, loading, error, data } = queryResponse;

     let parsedData = undefined;

    // useEffect(() => {
    //     runQuery({
    //         variables: {
    //             filters: {
    //                 searchTerm: inputText,
    //                 productAttributes: [
    //                     {
    //                         attribute: 'Color',
    //                         values: ['Plata']
    //                     }
    //                 ]
    //             },
    //             sort: 'A_TO_Z'
    //         }
    //     });








    const { data, loading, error, refetch } = useQuery(getProductsDetailsBySearchQuery, {
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        },
        variables: {
            filters: {
                                searchTerm: inputText,
                                productAttributes: [
                                    {
                                        attribute: 'Color',
                                        values: ['Plata']
                                    }
                                ]
                            },
                            sort: 'A_TO_Z'
        }
    });





        //console.log('antes del parser', data);

        if (data) {
            // try {
            //parsedData = getProductsDetailsBySearchParser(data, currentPage, pageSize);
            parsedData = getProductsDetailsBySearchParser(data);
            // } catch (e) {
            //     console.error(e);
            // }
        }
        //console.log('despues del parser', parsedData);
        return { data: parsedData, loading, error };
    
    //, [runQuery, currentPage, pageSize, data]);

  

    // const { data, loading, error } = useQuery(getCategoryQuery, {
    //     context: {
    //         headers: {
    //             backendTechnology: ['bigcommerce']
    //         }
    //     },
    //     variables: {
    //         id: id,
    //         filters: filters,
    //         // sort: sortReference[sort]
    //         sort: "A_TO_Z", //Use the BigCommerce sort options. Set them in the storefront
    //     }
    // });


};

export default GetProductsDetailsBySearch;
