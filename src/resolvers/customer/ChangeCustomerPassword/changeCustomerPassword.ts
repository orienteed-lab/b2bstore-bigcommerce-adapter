import { ClientProps } from 'src';
import { ChangeCustomerPasswordMutationVariables } from '@schema';

import DEFAULT_OPERATIONS from './changeCustomerPassword.gql';
import { useState } from 'react';

const ChangeCustomerPassword = (clientProps: ClientProps) => (resolverProps: ChangeCustomerPasswordMutationVariables) => {
    const { mergeOperations, useMutation, restClient } = clientProps;
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const { signInMutation } = mergeOperations(DEFAULT_OPERATIONS);

    const [signIn] = useMutation(signInMutation);

    const changeCustomerPassword = async ({ variables }) => {
        setLoading(true);
        try {
            const { data } = await signIn({
                variables: {
                    email: variables.email,
                    password: variables.currentPassword
                },
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                }
            });
            if (data.login?.customer?.entityId) {
                const customerData = [
                    {
                        id: data.login.customer.entityId,
                        authentication: {
                            new_password: variables.newPassword
                        }
                    }
                ];

                await restClient(`/api/v3/customers`, {
                    method: 'PUT',
                    headers: {
                        backendTechnology: ['bigcommerce']
                    },
                    body: JSON.stringify(customerData)
                });
            }
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { changeCustomerPassword, loading, error };
};

export default ChangeCustomerPassword;
