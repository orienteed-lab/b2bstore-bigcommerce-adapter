import { ClientProps } from 'src';
import { GetProductThumbnailsByUrlKeyQueryVariables } from '@schema';
import { getProductThumbnailsByUrlKeyParser } from './getProductThumbnailsByUrlKeyParser';

import DEFAULT_OPERATIONS from './getProductThumbnailsByUrlKey.gql';
import { useEffect, useState } from 'react';

const GetProductThumbnailsByUrlKey = (clientProps: ClientProps) => (resolverProps: GetProductThumbnailsByUrlKeyQueryVariables) => {
    const { mergeOperations, useAwaitQuery } = clientProps;
    const { urlKeys } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const products = [];

    const { getProductThumbnailsByUrlKeyQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getProduct = useAwaitQuery(getProductThumbnailsByUrlKeyQuery)

    useEffect(() => {
        const getProductThumbnails = async () => {
            setLoading(true);
            for(let i = 0; i<urlKeys.length; i++) {
                const { data: product } = await getProduct({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    },
                    variables: {
                        url: `/${urlKeys[i]}`
                    }
                });
        
                products.push(product.site.route.node);
            };

            setData(getProductThumbnailsByUrlKeyParser(products));
            setLoading(false);
        };
        getProductThumbnails();
    }, [])

    return { data, loading };
};

export default GetProductThumbnailsByUrlKey;
