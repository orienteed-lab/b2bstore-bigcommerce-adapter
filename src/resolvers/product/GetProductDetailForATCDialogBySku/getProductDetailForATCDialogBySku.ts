import { ClientProps } from 'src';
import { GetProductDetailForAtcDialogBySkuQueryVariables } from '@schema';

import { getProductDetailForATCDialogBySkuParser } from './getProductDetailForATCDialogBySkuParser';
import DEFAULT_OPERATIONS from './getProductDetailForATCDialogBySku.gql';

interface GetProductDetailForAtcDialogBySkuProps extends GetProductDetailForAtcDialogBySkuQueryVariables {
    optionValueIds?: [{ optionEntityId: number; valueEntityId: number }];
}

const GetProductDetailForATCDialogBySku = (clientProps: ClientProps) => (resolverProps: GetProductDetailForAtcDialogBySkuProps) => {
    const { mergeOperations, useQuery } = clientProps;
    const { sku, configurableOptionValues } = resolverProps;
    const optionValueIds = []; // In BigCommerce is required to give optionId and valueId in the query props

    for (let i = 0; i<configurableOptionValues.length; i=i+2) {
        optionValueIds.push({
            "optionEntityId": configurableOptionValues[i],
            "valueEntityId": configurableOptionValues[i+1]
        })
    };

    const { getProductDetailForAtcDialogBySkuQuery } = mergeOperations(DEFAULT_OPERATIONS);

    const { data, loading } = useQuery(getProductDetailForAtcDialogBySkuQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        },
        variables: {
            optionValueIds,
            sku
        },
        skip: !sku
    });

    let parsedData = undefined;
    if (data) {
        parsedData = getProductDetailForATCDialogBySkuParser(data);
    }

    return { data: parsedData, loading };
};

export default GetProductDetailForATCDialogBySku;
