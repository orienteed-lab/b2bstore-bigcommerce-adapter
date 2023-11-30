import { ClientProps } from 'src';
import { PlaceOrderMutationVariables } from '@schema';

import { placeOrderParser } from './placeOrderParser';
import { useState } from 'react';

const PlaceOrder = (clientProps: ClientProps) => (resolverProps: PlaceOrderMutationVariables) => {
    const { restClient } = clientProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const runPlaceOrder = async ({ variables, paymentData }) => {
        let parsedData = undefined;
        let paymentId = undefined;
        setLoading(true);
        // try {
            const orderData = await restClient(`/api/v2/orders?cart_id=${variables.cartId}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            const { data: acceptedPaymentsData } = await restClient(`/api/v3/payments/methods?order_id=${orderData[0].id}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            paymentId = acceptedPaymentsData.find((m) => m.type === paymentData.type)?.id;

            if (paymentId) {
                const { data: payment } = await restClient(`/api/v3/payments/access_tokens`, {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: JSON.stringify({ order: { id: orderData[0].id } })
                });

                await restClient(`https://cors-anywhere.herokuapp.com/https://payments.bigcommerce.com/stores/qpq1ivfvi6/payments`, {
                    method: 'POST',
                    headers: {
                        accept: 'application/vnd.bc.v1+json',
                        authorization: `PAT ${payment.id}`
                    },
                    body: JSON.stringify({ payment: { instrument: { type: paymentData.type }, payment_method_id: paymentId } })
                });
            }

            parsedData = placeOrderParser(orderData[0].id);
        // } catch (err) {
        //     console.log(err)
        //     setError(err);
        // }

        setData(parsedData);
        setLoading(false);

        return { data: parsedData };
    };

    return { runPlaceOrder, data, loading, error };
};

export default PlaceOrder;
