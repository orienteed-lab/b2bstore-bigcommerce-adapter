import { ClientProps } from 'src';
import { CreateWishlistMutationVariables } from '@schema';
import DEFAULT_OPERATIONS from './createWishlist.gql';

import { createWishlistParser } from './createWishlistParser';
import { useState } from 'react';


const CreateWishlist = (clientProps: ClientProps) => (resolverProps: CreateWishlistMutationVariables) => {
    const { useMutation, mergeOperations } = clientProps;
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const { createWishlistMutation } = mergeOperations(DEFAULT_OPERATIONS);
    const [createList] = useMutation(createWishlistMutation);
    
    const createWishlist = async ({ variables }) => {
        let parsedData = undefined;
        setLoading(true);
        try {
            const {data: data1} = await createList ({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: { 
                    input: {
                        name: variables.input.name,
                        isPublic: variables.input.visibility === 'PRIVATE'? false : true
                    }
                }
            });

            parsedData = createWishlistParser(data1);
        } catch (err) {
            setError(err);
        }
        setLoading(false);
        return {data: parsedData};
    };

    return { createWishlist, loading, error };
};


export default CreateWishlist;
