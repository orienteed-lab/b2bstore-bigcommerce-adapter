import { ClientProps } from 'src';
import { GetSimpleProductQueryVariables } from '@schema';

import { getSimpleProductParser } from './getSimpleProductParser';
import DEFAULT_OPERATIONS from './getSimpleProduct.gql';

const GetSimpleProduct = (clientProps: ClientProps) => (resolverProps: GetSimpleProductQueryVariables) => {
    const { useQuery, mergeOperations } = clientProps;
    const { sku } = resolverProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getSimpleProductQuery } = operations;

    const { data, loading, error } = useQuery(getSimpleProductQuery, {
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        },
        variables: {
            productSku: sku
        }
    });

    let parsedData = {};
    if (data) {
        try {
            parsedData = getSimpleProductParser(data);
        } catch (e) {
            console.error(e);
        }
    }

    return { data: parsedData, loading, error };
};

export default GetSimpleProduct;
