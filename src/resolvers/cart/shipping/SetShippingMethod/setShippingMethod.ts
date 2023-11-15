import { ClientProps } from 'src';
import { SetShippingMethodMutationVariables } from '@schema';
import { useState } from 'react';

interface SetShippingMethodProps extends SetShippingMethodMutationVariables {
    onSuccess: any;
    hasOnSuccess: boolean;
}

const SetShippingMethod = (clientProps: ClientProps) => (resolverProps: SetShippingMethodProps) => {
    const { restClient } = clientProps;
    const { hasOnSuccess } = resolverProps;
    const [called, setCalled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, seterror] = useState(undefined);

    const setShippingMethod = async ({ variables }) => {
        setLoading(true);
        setCalled(true);

        try {
            const { data: cartData } = await restClient(`/api/v3/checkouts/${variables.cartId}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            await restClient(`/api/v3/checkouts/${variables.cartId}/consignments/${cartData.consignments[0].id}`, {
                method: 'PUT',
                headers: {
                    backendTechnology: 'bigcommerce'
                },
                body: JSON.stringify({ shipping_option_id: variables.shippingMethod.carrier_code })
            });

            if (hasOnSuccess) {
                const { onSuccess } = resolverProps;
                onSuccess();
            }
        } catch (err) {
            seterror(err);
        }

        setLoading(false);
    };

    return { setShippingMethod, setShippingMethodCall: setShippingMethod, loading, called, error };
};

export default SetShippingMethod;
