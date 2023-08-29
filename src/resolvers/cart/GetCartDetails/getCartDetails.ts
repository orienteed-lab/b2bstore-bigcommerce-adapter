import { ClientProps } from 'src';

import { getCartDetailsParser } from './getCartDetailsParser';
import { useState } from 'react';

const GetCartDetails = (clientProps: ClientProps) => () => {
    const { restClient } = clientProps;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(null);
    const [called, setCalled] = useState(false);

    const fetchCartDetails = async ({ variables }) => {
        setLoading(true);
        setCalled(true);
        try {
            const rawData = await restClient(
                `/api/v3/carts/${variables.cartId}?include=line_items.physical_items.options,line_items.digital_items.options`,
                {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                }
            );

            if (rawData) {
                setData(getCartDetailsParser(rawData));
            }
        } catch (err: any) {
            setError(err);
        }
        setLoading(false);
    };

    return { fetchCartDetails, data, loading, error, called };
};

export default GetCartDetails;
