import { ClientProps } from 'src';
import { GetRouteDataQueryVariables } from '@schema';

import DEFAULT_OPERATIONS from './getRouteData.gql'
import { getRouteDataParser } from './getRouteDataParser';
import { useState } from 'react';

const GetRouteData = (clientProps: ClientProps) => (resolverProps: GetRouteDataQueryVariables) => {
    const { mergeOperations, useAwaitQuery } = clientProps;
    const [data, setData] = useState(undefined);

    const { getRouteDataQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getPath = useAwaitQuery(getRouteDataQuery);

    const fetchRouteData = async ({variables}) => {
        let parsedData = undefined;
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
        
        parsedData = getRouteDataParser(pathData, variables.url);
        setData(parsedData);
        
        return { data: parsedData }
    }

    return { fetchRouteData };
};

export default GetRouteData;
