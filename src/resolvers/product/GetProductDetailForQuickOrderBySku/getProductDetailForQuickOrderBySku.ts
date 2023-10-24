import { ClientProps } from 'src';
import { GetProductDetailForQuickOrderBySkuQueryVariables } from '@schema';

import { getProductDetailForQuickOrderBySkuParser } from './getProductDetailForQuickOrderBySkuParser';
import DEFAULT_OPERATIONS from './getProductDetailForQuickOrderBySku.gql';

const GetProductDetailForQuickOrderBySku =
    (clientProps: ClientProps) =>
    (resolverProps: GetProductDetailForQuickOrderBySkuQueryVariables = { sku: '' }) => {
        const { useAwaitQuery, mergeOperations } = clientProps;

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getProductDetailForQuickOrderBySkuQuery } = operations;

        const getProductDetail = useAwaitQuery(getProductDetailForQuickOrderBySkuQuery);

        const getproduct = async ({ variables }) => {
            const { data } = await getProductDetail({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    sku: variables.sku
                }
            });

            let parsedData = undefined;

            if (data) {
                parsedData = getProductDetailForQuickOrderBySkuParser(data, variables.sku);
            }

            return { data: parsedData };
        };

        return { getproduct };
    };

export default GetProductDetailForQuickOrderBySku;
