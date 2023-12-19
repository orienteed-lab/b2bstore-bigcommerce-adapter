import { ClientProps } from 'src';
import { AddQuoteToCartMutationVariables } from '@schema';

const AddQuoteToCart = (clientProps: ClientProps) => (resolverProps: AddQuoteToCartMutationVariables) => {
    const { restClient } = clientProps;

    const addMpQuoteToCart = async ({ variables }) => {
        const { data: quoteData } = await restClient(`/api/v3/io/rfq/${variables.quoteId}`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerceb2b'
            }
        });

        const body = {
            line_items: quoteData.productList.map((prod) => ({
                quantity: prod.quantity,
                product_id: prod.productId,
                variant_id: prod.variantId
            }))
        };

        await restClient(`/api/v3/carts/${variables.cartId}/items`, {
            method: 'POST',
            headers: {
                backendTechnology: 'bigcommerce'
            },
            body: JSON.stringify(body)
        });
    };

    return { addMpQuoteToCart };
};

export default AddQuoteToCart;
