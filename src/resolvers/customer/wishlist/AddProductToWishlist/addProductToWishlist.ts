import { ClientProps } from 'src';
import { AddProductToWishlistMutationVariables } from '@schema';

import DEFAULT_OPERATIONS from './addProductToWishlist.gql';
import { addProductToWishlistParser } from './addProductToWishlistParser';

import { useState } from 'react';
const AddProductToWishlist = (clientProps: ClientProps) => (resolverProps: AddProductToWishlistMutationVariables) => {
    const { useMutation, mergeOperations, useAwaitQuery } = clientProps;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const [data, setData] = useState(undefined);

    const { getItemIdBySkuQuery, addProductToWishlistMutation, getWishlistIdQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getItemId = useAwaitQuery(getItemIdBySkuQuery);
    const getWishlist = useAwaitQuery(getWishlistIdQuery);
    const [addProduct] = useMutation(addProductToWishlistMutation);

    const addProductToWishlist = async ({ variables }) => {
        setLoading(true);
        try {
            const { data: wishists } = await getWishlist({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                }
            });
            const { data: itemData } = await getItemId({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    sku: variables.itemOptions.sku
                }
            });
            const input = {
                entityId: variables.wishlistId === '0' ? wishists.customer.wishlists.edges[0].node.entityId : variables.wishlistId,
                items: [{ productEntityId: itemData.site.product.entityId }]
            };
            await addProduct({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    items: input
                }
            });

            setData(addProductToWishlistParser([]));
        } catch (err) {
            setData(addProductToWishlistParser([err]));
            setError(err);
        }
        setLoading(false);
    };

    return { addProductToWishlist, loading, error, data };
};

export default AddProductToWishlist;
