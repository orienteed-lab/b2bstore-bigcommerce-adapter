import { ClientProps } from 'src';
import { GetProductDetailForProductPageByUrlKeyQueryVariables } from '@schema';

import { getProductDetailForProductPageByUrlKeyParser } from './getProductDetailForProductPageByUrlKeyParser';
import DEFAULT_OPERATIONS from './getProductDetailForProductPageByUrlKey.gql';
import { useEffect, useState } from 'react';

interface GetProductDetailForProductPageByUrlKeyProps extends GetProductDetailForProductPageByUrlKeyQueryVariables {
    storeConfigData: any;
}

const GetProductDetailForProductPageByUrlKey =
    (clientProps: ClientProps) => (resolverProps: GetProductDetailForProductPageByUrlKeyProps) => {
        const { useAwaitQuery, mergeOperations } = clientProps;
        const { urlKey, storeConfigData } = resolverProps;

        const [parsedData, setParsedData] = useState(undefined);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(undefined);

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getProductDetailForProductPageByUrlKeyQuery } = operations;
        const getProduct = useAwaitQuery(getProductDetailForProductPageByUrlKeyQuery);

        const refetch = async () => {
            setLoading(true);
            try {
                const { data } = await getProduct({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    },
                    skip: !storeConfigData,
                    variables: {
                        urlPath: `/${urlKey}`
                    }
                });

                setParsedData(getProductDetailForProductPageByUrlKeyParser(data));
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };

        useEffect(() => {
            refetch();
        }, []);

        return { data: parsedData, loading, error: error, refetch };
    };

export default GetProductDetailForProductPageByUrlKey;
