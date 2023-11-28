import { ClientProps } from 'src';
import { GetSalesRulesDataQueryVariables } from '@schema';
import { useEffect, useState } from 'react';

import { getSalesRulesDataParser } from './getSalesRulesDataParser';
const GetSalesRulesData = (clientProps: ClientProps) => (resolverProps: GetSalesRulesDataQueryVariables) => {
    const { restClient } = clientProps;
    const { cartId } = resolverProps;

    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (cartId) {
                    const rawData = await restClient(
                        `/api/v3/carts/${cartId}?include=cart.line_items.physical_items.options,cart.line_items.digital_items.options`,
                        {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        }
                    );
                    setData(getSalesRulesDataParser(rawData.data));
            };
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data: data, loading: loading};
};

export default GetSalesRulesData;
