import { ClientProps } from 'src';
import { DeleteSavedCartsMutationVariables } from '@schema';

const DeleteSavedCarts = (clientProps: ClientProps) => (resolverProps: DeleteSavedCartsMutationVariables) => {
    const { restClient } = clientProps;
    const { token } = resolverProps;

    const deleteSaveCart = async () => {
        await restClient(`/api/v3/io/shopping-list/${token}`, {
            method: 'DELETE',
            headers: {
                backendTechnology: 'bigcommerceb2b'
            }
        });
    };

    return { deleteSaveCart };
};

export default DeleteSavedCarts;
