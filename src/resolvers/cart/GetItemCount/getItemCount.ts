import { ClientProps } from 'src';
import { GetItemCountQueryVariables } from '@schema';

import { getItemCountParser } from './getItemCountParser';
import { useEffect, useState } from 'react';
const GetItemCount = (clientProps: ClientProps) => (resolverProps: GetItemCountQueryVariables) => {
    const { restClient } = clientProps;
    const { cartId }  = resolverProps;
 
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rawData = await restClient(
                    `/api/v3/carts/${cartId}?include=line_items.physical_items.options,line_items.digital_items.options`,
                    {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    }
                );
                
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

        parsedData = getItemCountParser(data);

    }
    return { data: parsedData, loading, error };
};

export default GetItemCount;
