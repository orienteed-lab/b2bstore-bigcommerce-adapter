import { ClientProps } from 'src';
import { GetCategoryQueryVariables } from '@schema';
import { useEffect } from 'react';

import { getCategoryParser } from './getCategoryParser';
import DEFAULT_OPERATIONS from './getCategory.gql';

const GetCategory = (clientProps: ClientProps) => (resolverProps: GetCategoryQueryVariables) => {
    const { useQuery, mergeOperations, useLazyQuery } = clientProps;
    const { id, pageSize, currentPage, filters, sort } = resolverProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getCategoryQuery } = operations;

    const sortReference = {
        'name:asc': 'A_TO_Z',
        'name:desc': 'Z_TO_A',
        'price:asc': 'LOW_TO_HIGH',
        'price:desc': 'HIGH_TO_LOW',
        'relevance:desc': 'RELEVANCE',
        'position:asc': 'FEATURED'
    }

    const [runQuery, { called, loading, error, data }] = useLazyQuery(getCategoryQuery, { //TODO_B2B: Only showing the first 50 products
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        },
        variables: {
            id: id,
            filters: filters,
            sort: sortReference[String(sort)]
        }
    });

    let parsedData = undefined;

    useEffect(() => {
        runQuery();
    }, [currentPage, pageSize]);

        if (data) {
            // try {
            parsedData = getCategoryParser(data, currentPage, pageSize);
            // } catch (e) {
            //     console.error(e);
            // }
        }

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

    return { data: parsedData, loading, error, called };
};

export default GetCategory;
