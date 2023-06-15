import { ClientProps } from 'src';
import { GetCartDetailsQueryVariables } from '@schema';

import { getCartDetailsParser } from './getCartDetailsParser';
import { useEffect, useState } from 'react';

const GetCartDetails = (clientProps: ClientProps) => () => {
    const { restClient } = clientProps;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(null);

    const fetchCartDetails = ({ variables }) => {
        const fetchData = async () => {
        let parsedData = undefined;
        setLoading(true);
        try {
            
            const rawData = await restClient(
                `/api/v3/carts/${variables.cartId}?include=line_items.physical_items.options,line_items.digital_items.options`,
                {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                }
            );
                
            if (rawData) { 
                parsedData = getCartDetailsParser(rawData);
                setData(parsedData);

            }
        } catch (err: any) {
            setError(err);
        }
        setLoading(false);
        };
        fetchData();
    };

    return { fetchCartDetails, data , loading, error };
};

export default GetCartDetails;
