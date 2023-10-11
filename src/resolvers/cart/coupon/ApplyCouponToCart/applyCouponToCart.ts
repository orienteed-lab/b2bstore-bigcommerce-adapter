import { ClientProps } from 'src';
import { ApplyCouponToCartMutationVariables } from '@schema';
import { useState } from 'react';

const ApplyCouponToCart = (clientProps: ClientProps) => (resolverProps: ApplyCouponToCartMutationVariables) => {
    const { restClient } = clientProps;
    const [called, setCalled] = useState(false);
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const applyCoupon = async ({ variables }) => {
        setLoading(true);
        setCalled(true);
        try {
            const coupon = { coupon_code: variables.couponCode };

            await restClient(`/api/v3/checkouts/${variables.cartId}/coupons`, {
                method: 'POST',
                headers: {
                    backendTechnology: 'bigcommerce'
                },
                body: JSON.stringify(coupon)
            });
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { applyCoupon, called, loading, error };
};

export default ApplyCouponToCart;
