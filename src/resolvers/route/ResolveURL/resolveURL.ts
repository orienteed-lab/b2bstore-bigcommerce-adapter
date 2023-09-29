import { ClientProps } from 'src';
import { ResolveUrlQueryVariables } from '@schema';

import DEFAULT_OPERATIONS from './resolveURL.gql';
import { resolveURLParser } from './resolveURLParser';
import { useState } from 'react';

const ResolveURL = (clientProps: ClientProps) => (resolverProps: ResolveUrlQueryVariables) => {
    const { mergeOperations, useAwaitQuery } = clientProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const [called, setCalled] = useState(false);

    const { resolveUrlQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getPath = useAwaitQuery(resolveUrlQuery);

    const runQuery = async ({variables}) => {
        let parsedData = undefined;
        setLoading(true);
        setCalled(true);
        try {
            const { data: pathData } = await getPath({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    path: variables.url.split('.html')[0]
                }
            });

            parsedData = resolveURLParser(pathData, variables.url);
            setData(parsedData);
        } catch (err) {
            setError(err);
        }
        setLoading(false);

        return { data: parsedData }
    }



    return { data, loading, error, called, runQuery };
};

export default ResolveURL;
