import { ClientProps } from 'src';
import { RestoreSavedCartsMutationVariables } from '@schema';

const RestoreSavedCarts = (clientProps: ClientProps) => (resolverProps: RestoreSavedCartsMutationVariables) => {
    const { restClient } = clientProps;
    const { cartId, token } = resolverProps;

    const restoreSaveCart = async () => {
        const { data: listData } = await restClient(`/api/v3/io/shopping-list/${token}`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerceb2b'
            }
        });

        await restClient(`/api/v3/carts/${cartId}/items`, {
            method: 'POST',
            headers: {
                backendTechnology: 'bigcommerce'
            },
            body: JSON.stringify({
                line_items: listData.items.map((item) => ({
                    quantity: item.quantity,
                    product_id: item.productId,
                    variant_id: item.variantId
                }))
            })
        });
    };

    return { restoreSaveCart };
};

export default RestoreSavedCarts;
