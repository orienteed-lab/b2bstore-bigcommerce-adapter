import { ClientProps } from 'src';
import { useEffect, useState } from 'react';

const GenerateToken = (clientProps: ClientProps) => (resolverProps: any) => {
    const { restClient } = clientProps;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(null);

    const currentEpochTime = Date.now();
    const plusEpochTime = 10 * (60 * 60 * 1000);
    const totalEpochTime = Math.floor((currentEpochTime + plusEpochTime) / 1000);

    const body = {
        channel_id: 1,
        expires_at: totalEpochTime,
        allowed_cors_origins: [window.location.origin]
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rawData = await restClient('/api/v3/storefront/api-token', {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: JSON.stringify(body)
                });
                // setData(generateTokenParser(rawData));
                setData(rawData);
            } catch (err: any) {
                setError(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading, error };
};

export default GenerateToken;
