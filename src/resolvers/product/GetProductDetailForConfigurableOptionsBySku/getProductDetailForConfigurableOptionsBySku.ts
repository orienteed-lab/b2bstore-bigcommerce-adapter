import { ClientProps } from 'src';
import { GetProductDetailForConfigurableOptionsBySkuQueryVariables } from '@schema';

import { getProductDetailForConfigurableOptionsBySkuParser } from './getProductDetailForConfigurableOptionsBySkuParser';
import DEFAULT_OPERATIONS from './getProductDetailForConfigurableOptionsBySku.gql';
import { useState } from 'react';

interface GetProductDetailForConfigurableOptionsBySkuProps extends GetProductDetailForConfigurableOptionsBySkuQueryVariables {
    isLazy: boolean;
    cartItem?: any;
}
const GetProductDetailForConfigurableOptionsBySku =
    (clientProps: ClientProps) =>
    (resolverProps: GetProductDetailForConfigurableOptionsBySkuProps = { isLazy: false, cartItem: null }) => {
        const { useQuery, mergeOperations, useAwaitQuery } = clientProps;
        const { isLazy, cartItem } = resolverProps;
        const [data, setData] = useState(undefined);
        const [loading, setLoading] = useState(!isLazy);
        const [error, setError] = useState(undefined);

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getProductDetailForConfigurableOptionsBySkuQuery } = operations;
        const getDetails = useAwaitQuery(getProductDetailForConfigurableOptionsBySkuQuery);

        let parsedData = undefined;

        if (isLazy) {
            const runQuery = async () => {
                setLoading(true);
                try {
                    const { data: productData } = await getDetails({
                        context: {
                            headers: {
                                backendTechnology: ['bigcommerce']
                            }
                        }
                    });

                    setData(getProductDetailForConfigurableOptionsBySkuParser(productData));
                } catch (err) {
                    setError(err);
                }
                setLoading(false);
            };

            return { queryResult: { data, loading, error }, runQuery };
        } else {
            const { loading, error, data } = useQuery(getProductDetailForConfigurableOptionsBySkuQuery, {
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    sku: cartItem ? cartItem.product.sku : null
                }
            });

            if (data) {
                parsedData = getProductDetailForConfigurableOptionsBySkuParser(data);
            }

            return { data: parsedData, loading, error };
        }
    };
export default GetProductDetailForConfigurableOptionsBySku;
