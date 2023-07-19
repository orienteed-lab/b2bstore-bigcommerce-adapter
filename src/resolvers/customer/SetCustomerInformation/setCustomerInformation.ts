import { ClientProps } from 'src';
import { SetCustomerInformationMutationVariables } from '@schema';

import DEFAULT_OPERATIONS from './setCustomerInformation.gql';
import { useState } from 'react';

const SetCustomerInformation = (clientProps: ClientProps) => (resolverProps: SetCustomerInformationMutationVariables) => {
    const { mergeOperations, useMutation, restClient } = clientProps;
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const { signInMutation } = mergeOperations(DEFAULT_OPERATIONS);

    const [signIn] = useMutation(signInMutation);

    const setCustomerInformation = async ({ variables }) => {
        setLoading(true);
        try {
            const { data } = await signIn({
                variables: {
                    email: variables.initialEmail,
                    password: variables.customerInput.password
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
                        email: variables.customerInput.email,
                        first_name: variables.customerInput.firstname,
                        last_name: variables.customerInput.lastname
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

    return { setCustomerInformation, loading, error };
};

export default SetCustomerInformation;
