import { ClientProps } from 'src';
import { CreateAccountMutationVariables } from '@schema';
import { useState } from 'react';

const CreateAccount = (clientProps: ClientProps) => (resolverProps: CreateAccountMutationVariables = {email: "", firstname: "", is_subscribed: null, lastname: "", password: ""}) => {
    const { restClient } = clientProps;
    const [error, setError] = useState(undefined);

    const createAccount = async ({variables}) => {
        const data = [
            {
                email: variables.email,
                first_name: variables.firstname,
                last_name: variables.lastname,
                authentication: {
                    force_password_reset: false,
                    new_password: variables.password
                },
                accepts_product_review_abandoned_cart_emails: variables.is_subscribed,
                origin_channel_id: 1,
                channel_ids: [1]
            }
        ];
        try {
            await restClient(`/api/v3/customers`, {
                method: 'POST',
                headers: {
                    backendTechnology: ['bigcommerce']
                },
                body: JSON.stringify(data)
            });
        } catch (err) {
            setError(err);
        }
    };

    return { createAccount, error };
};

export default CreateAccount;
