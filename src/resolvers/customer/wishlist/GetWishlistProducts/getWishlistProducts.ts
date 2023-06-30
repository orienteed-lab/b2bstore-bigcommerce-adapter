import { ClientProps } from 'src';
import { GetWishlistProductsQueryVariables } from '@schema';
import { useState } from 'react';

import { getWishlistProductsParser } from './getWishlistProductsParser';
import DEFAULT_OPERATIONS from './getWishlistProducts.gql';

const GetWishlistProducts = (clientProps: ClientProps) => (resolverProps: GetWishlistProductsQueryVariables) => {
    const { mergeOperations, useAwaitQuery, restClient } = clientProps;
    const { id, currentPage } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getProductsVariantsQuery } = operations;

    const searchVariants = useAwaitQuery(getProductsVariantsQuery);

    const fetchWishlistItems = async () => {
        let parsedData = undefined;
        let products = [];
        let variants = [];

        setLoading(true);
        const { data: productData } = await restClient(`/api/v3/wishlists/${id}`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerce'
            }
        });

        if (productData) {
            console.log('WTF IS THIS', productData)
            productData.items.map((item) => products.push(item.product_id));
            productData.items.map((item) => item.variant_id ? variants.push(item.variant_id) : null);

            const { data: variantData } = await searchVariants({
                nextFetchPolicy: 'cache-first',
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    productIds: products,
                    variantIds: variants
                }
            });

            if (variantData) {
                parsedData = getWishlistProductsParser(productData, variantData);
                setData(parsedData);
                console.log('Parsed data: ', parsedData)
                setLoading(false);
            }
        }
    };

    const fetchMore = async ({ variables }) => {
        // let parsedData = undefined;
        // let products = [];
        // let variants = [];

        // setLoading(true);
        // const { data: productData } = await fetchWishlist({
        //     nextFetchPolicy: 'cache-first',
        //     context: {
        //         headers: {
        //             backendTechnology: ['bigcommerce']
        //         }
        //     },
        //     variables: {
        //         id: variables.id,
        //         currentPage: variables.currentPage
        //     }
        // });

        // if (productData) {
        //     productData.customer.wishlists.edges[0].node.items.edges.map((item) => products.push(item.node.product.entityId));
        //     productData.customer.wishlists.edges[0].node.items.edges.map((item) =>
        //         item.node.product.variants.edges.map((variant) => variants.push(variant.node.entityId))
        //     );

        //     const { data: variantData } = await searchVariants({
        //         nextFetchPolicy: 'cache-first',
        //         context: {
        //             headers: {
        //                 backendTechnology: ['bigcommerce']
        //             }
        //         },
        //         variables: {
        //             productIds: products,
        //             variantIds: variants
        //         }
        //     });

        //     if (variantData) {
        //         try {
        //             parsedData = getWishlistProductsParser(productData, variantData);
        //             setData(parsedData);
        //             console.log('Parsed data: ', parsedData)
        //             setLoading(false);
        //         } catch (err: any) {
        //             setError(err);
        //         }
        //     }
        // }
    };

    return { fetchWishlistItems, queryResult: { data, error, loading, fetchMore } };
};

export default GetWishlistProducts;
