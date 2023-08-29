import { ClientProps } from 'src';
import { UpdateCartItemsMutationVariables } from '@schema';

import { useState } from 'react';

const UpdateCartItems = (clientProps: ClientProps) => (resolverProps: UpdateCartItemsMutationVariables) => {
    const { restClient } = clientProps;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const [called, setCalled] = useState(false);

    const updateItemQuantity = async ({ variables }) => {
        setLoading(true);
        setCalled(true);
        try {
            let itemEntityId = undefined;
            const rawData = await restClient(`/api/v3/carts/${variables.cartId}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            if (
                rawData.data.line_items.physical_items &&
                rawData.data.line_items.physical_items?.find((item) => item.id === variables.itemId)
            ) {
                itemEntityId = rawData.data.line_items.physical_items?.find((item) => item.id === variables.itemId).product_id;
            } else if (
                rawData.data.line_items.digital_items &&
                rawData.data.line_items.digital_items?.find((item) => item.id === variables.itemId)
            ) {
                itemEntityId = rawData.data.line_items.digital_items?.find((item) => item.id === variables.itemId).product_id;
            }

            await restClient(`/api/v3/carts/${variables.cartId}/items/${variables.itemId}`, {
                method: 'PUT',
                headers: {
                    backendTechnology: 'bigcommerce'
                },
                body: JSON.stringify({
                    line_item: {
                        quantity: variables.quantity,
                        product_id: itemEntityId
                    }
                })
            });
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { updateItemQuantity, loading, error, called };
};

export default UpdateCartItems;
