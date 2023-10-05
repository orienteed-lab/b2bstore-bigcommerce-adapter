import { ClientProps } from 'src';

import { getProductsInWishlistsParser } from './getProductsInWishlistsParser';
import DEFAULT_OPERATIONS from './getProductsInWishlists.gql';
import { useEffect, useState } from 'react';

const GetProductsInWishlists = (clientProps: ClientProps) => () => {
    const { mergeOperations, useQuery, useLazyQuery } = clientProps;
    const [data, setData] = useState({ customerWishlistProducts: [] });
    const [client, setClient] = useState(undefined);

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getProductsInWishlistsQuery } = operations;
    const [getProducts] = useLazyQuery(getProductsInWishlistsQuery, {
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            const { data: productData, client: prodClient } = await getProducts();
            setClient(prodClient);

            setData(getProductsInWishlistsParser(productData));
        };
        fetchData();
    }, []);

    return { data, client, getProductsInWishlistsQuery };
};

export default GetProductsInWishlists;
