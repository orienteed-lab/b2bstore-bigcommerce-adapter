import { ClientProps } from 'src';
import { GetProductListingQueryVariables } from '@schema';

import { getProductListingParser } from './getProductListingParser';
import { useEffect, useState } from 'react';

interface GetCartDetailsProps {
    variables: GetProductListingQueryVariables;
}

const GetProductListing = (clientProps: ClientProps) => (resolverProps: GetCartDetailsProps) => {
    const { restClient } = clientProps;
    const {
        variables: { cartId }
    } = resolverProps;


    console.log({ cartId })

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
                // setData(generateTokenParser(rawData));
                setData(rawData);
            } catch (err: any) {
                setError(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    console.log('antes del parser', data);

    let parsedData = undefined;
    if (data) {
        // try {
        parsedData = getProductListingParser(data);
        // } catch (e) {
        //     console.error(e);
        // }
    }

    console.log('despues del parser', parsedData);

    //return { data, loading, error };
    return { data: parsedData, loading, error };
};

export default GetProductListing;
