import { ClientProps } from 'src';
import { GetCheckoutDetailsQueryVariables } from '@schema';

import { getCheckoutDetailsParser } from './getCheckoutDetailsParser';
import { useEffect, useState } from 'react';

const GetCheckoutDetails = (clientProps: ClientProps) => (resolverProps: GetCheckoutDetailsQueryVariables) => {
    const { restClient } = clientProps;
    const { cartId }  = resolverProps;
 
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [data2, setData2] = useState<any>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rawData = await restClient(
                    `/api/v3/checkouts/${cartId}?include=cart.line_items.physical_items.options,cart.line_items.digital_items.options`,
                    {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    }
                );
                const rawData2 = await restClient(
                    `/api/v2/payments/methods`,
                    {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    }
                );
                setData(rawData);
                setData2(rawData2);
            } catch (err: any) {
                setError(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);


    let parsedData = undefined;
    if (data) {
        // try {
        parsedData = getCheckoutDetailsParser(data, data2);
        // } catch (e) {
        //     console.error(e);
        // }
    }


    return { data: parsedData, loading, error };

};

export default GetCheckoutDetails;
