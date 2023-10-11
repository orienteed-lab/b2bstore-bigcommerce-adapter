import { ClientProps } from 'src';
import { RemoveCouponFromCartMutationVariables } from '@schema';
import { useState } from 'react';

const RemoveCouponFromCart = (clientProps: ClientProps) => (resolverProps: RemoveCouponFromCartMutationVariables) => {
    const { restClient } = clientProps;
    const [called, setCalled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const removeCoupon = async ({ variables }) => {
        setLoading(true);
        setCalled(true);
        try {
            await restClient(`/api/v3/checkouts/${variables.cartId}/coupons/${variables.couponCode}`, {
                method: 'DELETE',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { removeCoupon, called, loading, error };
};

export default RemoveCouponFromCart;
