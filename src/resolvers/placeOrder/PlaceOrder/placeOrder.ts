import { ClientProps } from 'src';
import { PlaceOrderMutationVariables } from '@schema';

import { placeOrderParser } from './placeOrderParser';
import { useState } from 'react';

const PlaceOrder = (clientProps: ClientProps) => (resolverProps: PlaceOrderMutationVariables) => {
    const { restClient } = clientProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const runPlaceOrder = async ({ variables }) => {
        let parsedData = undefined;
        setLoading(true);
        try {
            const orderData = await restClient(`/api/v2/orders?cart_id=${variables.cartId}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            parsedData = placeOrderParser(orderData[0].id);
        } catch (e) {
            try {
                const { data: orderData } = await restClient(`/api/v3/checkouts/${variables.cartId}/orders`, {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                });

                parsedData = placeOrderParser(orderData.id);
            } catch (err) {
                setError(err);
            }
        }
        setData(parsedData);
        setLoading(false);

        return { data: parsedData };
    };

    return { runPlaceOrder, data, loading, error };
};

export default PlaceOrder;
