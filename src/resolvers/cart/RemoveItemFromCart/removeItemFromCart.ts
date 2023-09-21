import { ClientProps } from 'src';
import { RemoveItemFromCartMutationVariables } from '@schema';

import { useState } from 'react';

const RemoveItemFromCart = (clientProps: ClientProps) => (resolverProps: RemoveItemFromCartMutationVariables) => {
    const { restClient } = clientProps;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [called, setCalled] = useState(false);

    const removeItem = async ({ variables }) => {
        setLoading(true);
        setCalled(true);
        try {
            await restClient(`/api/v3/carts/${variables.cartId}/items/${variables.itemId}`, {
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

    return { removeItem, loading, error, called };
};

export default RemoveItemFromCart;
