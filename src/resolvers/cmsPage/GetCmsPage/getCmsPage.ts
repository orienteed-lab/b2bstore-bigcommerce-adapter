import { ClientProps } from 'src';
import { GetCmsPageQueryVariables } from '@schema';

import { getCmsPageParser } from './getCmsPageParser';
import DEFAULT_OPERATIONS from './getCmsPage.gql';
import { useEffect, useState } from 'react';

const GetCmsPage = (clientProps: ClientProps) => (resolverProps: GetCmsPageQueryVariables) => {
    // Look docs for more info about how to fill this function
    const { mergeOperations, useAwaitQuery } = clientProps;
    const { identifier } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getCmsPageQuery } = operations;

    const getCmsPage = useAwaitQuery(getCmsPageQuery);

    const refetch = async () => {
        setLoading(true);
        try {
            const { data: cmsData } = await getCmsPage({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                //TODO: map string identifier to int identifier 
                variables: {
                    identifier: 6
                }
            });
            setData(getCmsPageParser(cmsData));
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        refetch();
    }, []);

    return { data, loading, error };
    //return { data: {}, loading: false, error: undefined };
};

export default GetCmsPage;
