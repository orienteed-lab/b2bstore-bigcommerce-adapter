import { ClientProps } from 'src';
import { GetProductDetailForAtcDialogBySkuQueryVariables } from '@schema';

import { getProductDetailForATCDialogBySkuParser } from './getProductDetailForATCDialogBySkuParser';
import DEFAULT_OPERATIONS from './getProductDetailForATCDialogBySku.gql';
import { useEffect, useState } from 'react';

const GetProductDetailForATCDialogBySku = (clientProps: ClientProps) => (resolverProps: GetProductDetailForAtcDialogBySkuQueryVariables) => {
    const { mergeOperations, useAwaitQuery } = clientProps;
    const { sku, configurableOptionValues } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const optionValueIds = []; // In BigCommerce is required to give optionId and valueId in the query props

    for (let i = 0; i<configurableOptionValues.length; i=i+2) {
        optionValueIds.push({
            "optionEntityId": configurableOptionValues[i],
            "valueEntityId": configurableOptionValues[i+1]
        })
    };

    const { getProductDetailForAtcDialogBySkuQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getDetails = useAwaitQuery(getProductDetailForAtcDialogBySkuQuery);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (sku) {
                const { data: productData } = getDetails(getProductDetailForAtcDialogBySkuQuery, {
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    },
                    variables: {
                        optionValueIds,
                        sku
                    }
                });

                setData(getProductDetailForATCDialogBySkuParser(productData))
            }
            setLoading(false);
        };
        fetchData();
    }, [])

    return { data, loading };
};

export default GetProductDetailForATCDialogBySku;
