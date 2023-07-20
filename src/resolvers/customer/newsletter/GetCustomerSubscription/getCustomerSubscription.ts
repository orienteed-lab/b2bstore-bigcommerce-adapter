import { ClientProps } from 'src';
import { GetCustomerSubscriptionQueryVariables } from '@schema';
import { getCustomerSubscriptionParser } from './getCustomerSubscriptionParser';

import { useEffect, useState } from 'react';

const GetCustomerSubscription = (clientProps: ClientProps) => (resolverProps: GetCustomerSubscriptionQueryVariables) => {
    const { restClient } = clientProps;
    const { email } = resolverProps;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rawData = await restClient(`/api/v3/customers/subscribers/?email:in=${email}`, {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                });

                setData(rawData);
            } catch (err: any) {
                setError(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    let parsedData = undefined;
    if (data) {
        parsedData = getCustomerSubscriptionParser(data);
    }

    return { data: parsedData, loading, error };
};

export default GetCustomerSubscription;
