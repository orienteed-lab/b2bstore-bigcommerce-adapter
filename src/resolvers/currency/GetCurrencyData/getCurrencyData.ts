import { useEffect, useState } from 'react';
import { ClientProps } from 'src';

import DEFAULT_OPERATIONS from './getCurrencyData.gql';
import { getCurrencyDataParser } from './getCurrencyDataParser';

const GetCurrencyData = (clientProps: ClientProps) => () => {
    const { mergeOperations, restClient, useAwaitQuery } = clientProps;
    const [data, setData] = useState(undefined);

    const { getCurrencyDataQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getCurrency = useAwaitQuery(getCurrencyDataQuery);

    useEffect(() => {
        const fetchData = async () => {
                const {data: currencyData} = await getCurrency({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    }
                });
                const isDefault = await restClient(`/api/v2/currencies`, {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                });
                setData(getCurrencyDataParser(currencyData, isDefault));
        };
        fetchData();
    }, []);

    return { data };
};

export default GetCurrencyData;
