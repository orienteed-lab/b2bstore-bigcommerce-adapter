import { useEffect, useState } from 'react';
import { ClientProps } from 'src';

import DEFAULT_OPERATIONS from './getStoreConfig.gql';
import { getStoreConfigParser } from './getStoreConfigParser';

const GetStoreConfig = (clientProps: ClientProps) => () => {
    const { mergeOperations, useAwaitQuery, restClient } = clientProps;
    const [data, setData] = useState(undefined);

    const { getStoreConfigQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getConfig = useAwaitQuery(getStoreConfigQuery);

    const refetch = async () => {
        const locale = await restClient(`/api/v3/settings/store/locale`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerce'
            }
        });

        const { data: configData } = await getConfig({
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            }
        });

        setData(getStoreConfigParser(locale, configData));
    };

    useEffect(() => {
        refetch();
    }, []);

    return { data, refetch };
};

export default GetStoreConfig;
