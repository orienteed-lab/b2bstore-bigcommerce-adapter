import { ClientProps } from 'src';
import { UpdateWishlistMutationVariables } from '@schema';
import DEFAULT_OPERATIONS from './updateWishlist.gql';
import { useState } from 'react';

const UpdateWishlist = (clientProps: ClientProps) => (resolverProps: UpdateWishlistMutationVariables) => {
    const { useMutation, mergeOperations } = clientProps;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { updateWishlistMutation } = mergeOperations(DEFAULT_OPERATIONS);
    const [updateList] = useMutation(updateWishlistMutation);

    const updateWishlist = async ({ variables }) => {
        setLoading(true);
        try {
            await updateList({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    input: {
                        entityId: variables.wishlistId,
                        data: {
                            name: variables.input.name,
                            isPublic: variables.input.visibility !== 'PRIVATE'
                        }
                    }
                }
            });
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { updateWishlist, loading, error };
};

export default UpdateWishlist;
