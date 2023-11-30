import { ClientProps } from 'src';
import { SetPaymentMethodOnCartMutationVariables } from '@schema';
import { useState } from 'react';

const SetPaymentMethodOnCart = (clientProps: ClientProps) => (resolverProps: SetPaymentMethodOnCartMutationVariables) => {
    const { restClient } = clientProps;
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [called, setCalled] = useState(false);

    const types = {
        // BigCommerce types: Manual, Credit Card, Cash,Test Payment Gateway, etc.
        creditsystem: 'store_credit',
        giftcertificate: 'gift_certificate', // TODO_B2BStore: Create a new file for gift certificate payments. This is MUST be changed
        braintree: 'card',
    };


    const fetch = async ({ variables }) => {
        setLoading(true);
        setCalled(true);
        try {
            const orderData = await restClient(`/api/v2/orders?cart_id=${variables.cartId}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            await restClient(`/api/v2/orders/${orderData[0].id}`, {
                method: 'PUT',
                headers: {
                    backendTechnology: 'bigcommerce'
                },
                body: JSON.stringify({ payment_method: types[variables.payment_method.code], status_id: 0 })
            });
        } catch (err) {
            setError(err);
        }
        setLoading(false)
    };

    return { fetch, loading, error, called };
};

export default SetPaymentMethodOnCart;
