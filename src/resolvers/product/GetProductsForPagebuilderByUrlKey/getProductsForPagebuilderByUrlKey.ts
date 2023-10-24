import { ClientProps } from 'src';
import { GetProductsForPagebuilderByUrlKeyQueryVariables } from '@schema';

import { getProductsForPagebuilderByUrlKeyParser } from './getProductsForPagebuilderByUrlKeyParser';
import DEFAULT_OPERATIONS from './getProductsForPagebuilderByUrlKey.gql';
import { useEffect, useState } from 'react';

const GetProductsForPagebuilderByUrlKey =
    (clientProps: ClientProps) => (resolverProps: GetProductsForPagebuilderByUrlKeyQueryVariables) => {
        const { mergeOperations, useAwaitQuery } = clientProps;
        const { pageSize, url_keys } = resolverProps;
        const [data, setData] = useState(undefined);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(undefined);

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getProductsForPagebuilderByUrlKey } = operations;

        const products = [];

        const getProducts = useAwaitQuery(getProductsForPagebuilderByUrlKey);

        const refetch = async () => {
            setLoading(true);
            for (let i = 0; i < pageSize; i++) {
                const response = await getProducts({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    },
                    variables: {
                        urlPath: `/${url_keys[i]}`
                    }
                });
                products.push(response.data.site.route);
            }

            try {
                if (products[pageSize - 1]) {
                    setData(getProductsForPagebuilderByUrlKeyParser(products));
                }
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };

        useEffect(() => {
            refetch();
        }, []);

        return { data, loading, error, refetch };
    };

export default GetProductsForPagebuilderByUrlKey;
