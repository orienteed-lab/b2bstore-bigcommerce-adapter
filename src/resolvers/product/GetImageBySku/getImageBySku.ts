import { ClientProps } from 'src';
import { GetImageBySkuQueryVariables } from '@schema';

import { getImageBySkuParser } from './getImageBySkuParser';
import DEFAULT_OPERATIONS from './getImageBySku.gql'

const GetImageBySku = (clientProps: ClientProps) => (resolverProps: GetImageBySkuQueryVariables) => {
    const { mergeOperations, useAwaitQuery } = clientProps;
    const { sku } = resolverProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getImageBySkuQuery } = operations;

    const { data, loading, error } = useAwaitQuery(getImageBySkuQuery,{
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
            parsedData = getImageBySkuParser(data);
        } catch (e) {
            console.error(e);
        }
    }

    return { data: parsedData, loading, error };
};

export default GetImageBySku;
