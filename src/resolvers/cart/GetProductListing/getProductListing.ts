import { ClientProps } from 'src';
import { GetProductListingQueryVariables } from '@schema';

import { getProductListingParser } from './getProductListingParser';
import { useCallback, useState } from 'react';

interface GetCartDetailsProps {
    variables: GetProductListingQueryVariables;
}

const GetProductListing = (clientProps: ClientProps) => (resolverProps: GetCartDetailsProps) => {
    const { restClient } = clientProps;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(undefined);
    const [error, setError] = useState(undefined);
    const [called, setCalled] = useState(false);

    const fetchProductListing = useCallback(async ({variables}) => {
        setLoading(true);
        setCalled(true);
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

            setData(getProductListingParser(rawData));
        } catch (err: any) {
            setError(err);
        }
        setLoading(false);
    }, []);

    return { fetchProductListing, data, loading, error, called };
};

export default GetProductListing;
