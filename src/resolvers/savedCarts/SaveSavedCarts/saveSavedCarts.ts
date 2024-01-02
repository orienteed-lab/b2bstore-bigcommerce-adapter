import { ClientProps } from 'src';
import { SaveSavedCartsMutationVariables } from '@schema';

import DEFAULT_OPERATIONS from './saveSavedCarts.gql';

const SaveSavedCarts = (clientProps: ClientProps) => (resolverProps: SaveSavedCartsMutationVariables) => {
    const { restClient, mergeOperations, useAwaitQuery } = clientProps;

    const { getUserIdQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getUserId = useAwaitQuery(getUserIdQuery);

    const getItems = (data) => {
        let items = [];
        if (data.line_items.physical_items) {
            data.line_items.physical_items.map((item: any) => {
                items.push({ productId: item.product_id, variantId: item.variant_id, quantity: item.quantity });
            });
        }

        if (data.line_items.digital_items) {
            data.line_items.digital_items.map((item: any) => {
                items.push({ productId: item.product_id, variantId: item.variant_id, quantity: item.quantity });
            });
        }
        return items;
    };

    const getMpSaveCart = async ({ variables }) => {
        const { data: cartData } = await restClient(`/api/v3/carts/${variables.cartId}`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerce'
            }
        });

        const { data: userData } = await getUserId({
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            }
        });

        const { data: customersData } = await restClient(`/api/v3/io/users?email=${userData.customer.email}`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerceb2b'
            }
        });

        const shoplistData = await restClient(`/api/v3/io/shopping-list`, {
            method: 'POST',
            headers: {
                backendTechnology: 'bigcommerceb2b'
            },
            body: JSON.stringify({
                name: variables.cartName,
                description: variables.description,
                status: 0,
                userId: customersData[0].id,
                channelId: 1,
                items: getItems(cartData)
            })
        });

        return { data: { o_mpSaveCart: shoplistData.code === 200 } };
    };

    return { getMpSaveCart };
};

export default SaveSavedCarts;
