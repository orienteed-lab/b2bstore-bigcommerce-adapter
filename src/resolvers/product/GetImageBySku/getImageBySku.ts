import { ClientProps } from 'src';
import { GetImageBySkuQueryVariables } from '@schema';

import { getImageBySkuParser } from './getImageBySkuParser';
import DEFAULT_OPERATIONS from './getImageBySku.gql'

const GetImageBySku = (clientProps: ClientProps) => (resolverProps: GetImageBySkuQueryVariables) => {
    const { mergeOperations, useAwaitQuery } = clientProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getImageBySkuQuery } = operations;

    const getImage = useAwaitQuery(getImageBySkuQuery);

    const fetchProductImage = async ({variables}) => {
        let parsedData = undefined;

        const { data } = await getImage({
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            },
            variables: {
                productSku: variables.sku
            }
        });

        try {
            parsedData = getImageBySkuParser(data, variables.sku);
        } catch (e) {
            console.error(e);
        }

        return { data: parsedData }
    }

    return { fetchProductImage };
};

export default GetImageBySku;
