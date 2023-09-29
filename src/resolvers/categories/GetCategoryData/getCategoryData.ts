import { ClientProps } from 'src';
import { GetCategoryDataQueryVariables } from '@schema';
import { getCategoryDataParser } from './getCategoryDataParser';
import DEFAULT_OPERATIONS from './getCategoryData.gql';

import { useCallback, useEffect, useState } from 'react';

interface GetCategoryDataProps extends GetCategoryDataQueryVariables {
    type: 'request';
}

const GetCategoryData = (clientProps: ClientProps) => (resolverProps: GetCategoryDataProps) => {
    const { mergeOperations, useAwaitQuery } = clientProps;
    const { type, id } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(type !== 'request');
    const [error, setError] = useState(undefined);

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getCategoryDataQuery } = operations;

    const getData = useAwaitQuery(getCategoryDataQuery);

    const runQuery = useCallback(async ({ variables }) => {
        setLoading(true);
        try {
            const { data: categoryData } = await getData({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    id: parseInt(variables.id)
                }
            });

            setData(getCategoryDataParser(categoryData));
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    }, []);

    // const runQuery = async ({ variables }) => {
    //     setLoading(true);
    //     try {
    //         const { data: categoryData } = await getData({
    //             context: {
    //                 headers: {
    //                     backendTechnology: ['bigcommerce']
    //                 }
    //             },
    //             variables: {
    //                 id: 23
    //             }
    //         });

    //         setData(getCategoryDataParser(categoryData));
    //     } catch (err) {
    //         setError(err);
    //     }
    //     setLoading(false);
    // };

    useEffect(() => {
        if (type !== 'request' && id) {
            runQuery({ variables: { id } });
        }
    }, []);

    return { runQuery, data, error, loading };
};

export default GetCategoryData;
