import { ClientProps } from 'src';
import { ShareSavedCartsMutationVariables } from '@schema';

const ShareSavedCarts = (clientProps: ClientProps) => (resolverProps: ShareSavedCartsMutationVariables) => {
    const { restClient } = clientProps;

    const getShareCart = async ({variables}) => {
        const { data: listData } = await restClient(`/api/v3/io/shopping-list/${variables.token}`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerceb2b'
            }
        });

        const { data: cartData } = await restClient(`/api/v3/carts/${variables.cartId}/items`, {
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

        return { data: { mpSaveCartShareCart: !!cartData.id } };
    };

    return { getShareCart };
};

export default ShareSavedCarts;
