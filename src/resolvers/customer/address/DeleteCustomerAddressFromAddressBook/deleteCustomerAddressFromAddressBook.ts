import { ClientProps } from 'src';
import { DeleteCustomerAddressFromAddressBookMutationVariables } from '@schema';
import { useState } from 'react';

const DeleteCustomerAddressFromAddressBook =
    (clientProps: ClientProps) => (resolverProps: DeleteCustomerAddressFromAddressBookMutationVariables) => {
        const { restClient } = clientProps;
        const [loading, setLoading] = useState(false);

        const deleteCustomerAddress = async ({ variables }) => {
            setLoading(true);
            try {
                await restClient(`/api/v3/customers/addresses?id:in=${variables.addressId}`, {
                    method: 'DELETE',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                });
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };

        return { deleteCustomerAddress, loading };
    };

export default DeleteCustomerAddressFromAddressBook;
