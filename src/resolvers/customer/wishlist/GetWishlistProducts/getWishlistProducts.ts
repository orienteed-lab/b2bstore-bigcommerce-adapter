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
    const { getWishlistProductsQuery, getProductsVariantsQuery } = operations;

    const fetchWishlist = useAwaitQuery(getWishlistProductsQuery);
    const searchVariants = useAwaitQuery(getProductsVariantsQuery);

    const fetchWishlistItems = async () => {
        let parsedData = undefined;
        let products = [];
        let variants = [];

        setLoading(true);
        const { data: productData } = await fetchWishlist({
            nextFetchPolicy: 'cache-first',
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            },
            variables: {
                id: id
            }
        });

        if (productData) {
            productData.customer.wishlists.edges[0].node.items.edges.map((item) => products.push(item.node.product.entityId));
            productData.customer.wishlists.edges[0].node.items.edges.map((item) =>
                item.node.product.variants.edges.map((variant) => variants.push(variant.node.entityId))
            );

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

            console.log('antes wishlist:', productData, variantData);

            if (variantData) {
                parsedData = getWishlistProductsParser(productData, variantData);
                setData(parsedData);
                setLoading(false);
            }
        }
    };

    const fetchMore = async ({ variables }) => {
        let parsedData = undefined;
        let products = [];
        let variants = [];

        setLoading(true);
        const { data: productData } = await fetchWishlist({
            nextFetchPolicy: 'cache-first',
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            },
            variables: {
                id: variables.id,
                currentPage: variables.currentPage
            }
        });

        if (productData) {
            productData.customer.wishlists.edges[0].node.items.edges.map((item) => products.push(item.node.product.entityId));
            productData.customer.wishlists.edges[0].node.items.edges.map((item) =>
                item.node.product.variants.edges.map((variant) => variants.push(variant.node.entityId))
            );

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
                try {
                    parsedData = getWishlistProductsParser(productData, variantData);
                    setData(parsedData);
                    setLoading(false);
                } catch (err: any) {
                    setError(err);
                }
            }
        }
    };

    return { fetchWishlistItems, queryResult: { data, error, loading, fetchMore } };
};

export default GetWishlistProducts;
