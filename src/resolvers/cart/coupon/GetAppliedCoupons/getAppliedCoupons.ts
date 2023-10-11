import { ClientProps } from 'src';
import { GetAppliedCouponsQueryVariables } from '@schema';

import { getAppliedCouponsParser } from './getAppliedCouponsParser';
import { useEffect, useState } from 'react';

const GetAppliedCoupons = (clientProps: ClientProps) => (resolverProps: GetAppliedCouponsQueryVariables) => {
    const { restClient } = clientProps;
    const { cartId }  = resolverProps;
 
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(undefined);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rawData = await restClient(
                    `/api/v3/checkouts/${cartId}`,
                    {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    }
                );
                
                setData(getAppliedCouponsParser(rawData));
            } catch (err: any) {
                setError(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading, error };
};

export default GetAppliedCoupons;
