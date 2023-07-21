import { ClientProps } from 'src';
import { SetNewsletterSubscriptionMutationVariables } from '@schema';

import DEFAULT_OPERATIONS from './setNewsletterSubscription.gql';
import { useState } from 'react';

const SetNewsletterSubscription = (clientProps: ClientProps) => (resolverProps: SetNewsletterSubscriptionMutationVariables) => {
    const { mergeOperations, useAwaitQuery, restClient } = clientProps;
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const { getCustomerInfoQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getCustomer = useAwaitQuery(getCustomerInfoQuery);

    const setNewsletterSubscription = async ({ variables }) => {
        setLoading(true);
        try {
            const { data } = await getCustomer({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                }
            });

            if (variables.isSubscribed) {
                const sub = {
                    email: data.customer.email,
                    first_name: data.customer.firstName,
                    last_name: data.customer.lastName,
                    source: 'storefront',
                    channel_id: 1
                };

                await restClient(`/api/v3/customers/subscribers`, {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: JSON.stringify(sub)
                });
            } else {
                await restClient(`/api/v3/customers/subscribers?email=${data.customer.email}`, {
                    method: 'DELETE',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                });
            }
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { setNewsletterSubscription, loading, error };
};

export default SetNewsletterSubscription;
