import { ClientProps } from 'src';
import { GetSelectedPaymentMethodQueryVariables } from '@schema';
import { useEffect, useState } from 'react';

import { getSelectedPaymentMethodParser } from './getSelectedPaymentMethodParser';

const GetSelectedPaymentMethod = (clientProps: ClientProps) => (resolverProps: GetSelectedPaymentMethodQueryVariables) => {
    const { restClient } = clientProps;
    const { cartId } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSelectedPaymentMethod = async () => {
            setLoading(true);
            if (cartId) {
                const orderData = await restClient(`/api/v2/orders?cart_id=${cartId}`, {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                });

                setData(getSelectedPaymentMethodParser(orderData[0]))
            }
            setLoading(false);
        };
        fetchSelectedPaymentMethod();
    }, []);

    return { data, loading };
};

export default GetSelectedPaymentMethod;
