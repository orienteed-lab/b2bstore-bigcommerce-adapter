import { ClientProps } from 'src';
import { SubscribeToNewsletterMutationVariables } from '@schema';
import { subscribeToNewsletterParser } from './subscribeToNewsletterParser';
import { useState } from 'react';

const SubscribeToNewsletter = (clientProps: ClientProps) => (resolverProps: SubscribeToNewsletterMutationVariables ) => {

    const { restClient } = clientProps;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(undefined);

    const subscribeNewsLetter = async ({ variables }) => {
        setLoading(true);
        try {
            const data = await restClient(`/api/v3/customers/subscribers`, {
                method: 'POST',
                headers: {
                    backendTechnology: 'bigcommerce'
                },
                body: JSON.stringify({email: variables.email})
            });

            setData(subscribeToNewsletterParser(data));
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { subscribeNewsLetter, loading, data };
};

export default SubscribeToNewsletter;
