import { ClientProps } from 'src';
import { subscribeToNewsletterParser } from './subscribeToNewsletterParser';
import { useState } from 'react';

interface SubscribeToNewsletterProps {
    setNewsLetterError?: any
}

const SubscribeToNewsletter = (clientProps: ClientProps) => (resolverProps: SubscribeToNewsletterProps ) => {

    const { restClient } = clientProps;
    const { setNewsLetterError } = resolverProps;
    const [loading, setLoading] = useState(false);
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
            setNewsLetterError(err);
        }
        setLoading(false);
    };

    return { subscribeNewsLetter, loading, data };
};

export default SubscribeToNewsletter;
