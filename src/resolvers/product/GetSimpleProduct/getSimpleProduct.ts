import { ClientProps } from 'src';
import { GetSimpleProductQueryVariables } from '@schema';

import { getSimpleProductParser } from './getSimpleProductParser';
import DEFAULT_OPERATIONS from './getSimpleProduct.gql';
import { useEffect, useState } from 'react';

const GetSimpleProduct = (clientProps: ClientProps) => (resolverProps: GetSimpleProductQueryVariables) => {
    const { useAwaitQuery, mergeOperations } = clientProps;
    const { sku } = resolverProps;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const [data, setData] = useState(undefined);

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getSimpleProductQuery } = operations;
    const getProduct = useAwaitQuery(getSimpleProductQuery);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data: productData } = await getProduct({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    },
                    variables: {
                        productSku: sku
                    }
                });

                setData(getSimpleProductParser(productData));
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };
        fetchProduct();
    }, []);

    return { data, loading, error };
};

export default GetSimpleProduct;
