import { ClientProps } from 'src';
import { AddConfigurableProductsToQuoteMutationVariables } from '@schema';

import { addConfigurableProductsToQuoteParser } from './addConfigurableProductsToQuoteParser';
import DEFAULT_OPERATIONS from './addConfigurableProductsToQuote.gql';
import moment from 'moment';

const AddConfigurableProductsToQuote = (clientProps: ClientProps) => (resolverProps: AddConfigurableProductsToQuoteMutationVariables) => {
    const { restClient, mergeOperations, useAwaitQuery } = clientProps;
    const { getProductAndVariantIdsQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getProduct = useAwaitQuery(getProductAndVariantIdsQuery);

    const addConfigProductToQuote = async ({ variables }) => {
        let parsedData = undefined;
        let totalPrice = 0;
        let totalQty = 0;

        const localDate = moment.utc().local();
        localDate.add(1, 'month');
        const localExpiredAt = localDate.format('MM/DD/YYYY');

        const products = await Promise.all(
            variables.input.cart_items.map(async (item) => {
                const { data } = await getProduct({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    },
                    variables: {
                        sku: item.data.sku || item.parent_sku
                    }
                });

                return {
                    entityId: data.site.product.entityId,
                    sku: item.data.sku || item.parent_sku,
                    variantId: data.site.product.variants.edges.find((p) => p.node.sku === (item.data.sku || item.parent_sku)).node.entityId,
                    quantity: item.data.quantity,
                    price: data.site.product.variants.edges.find((p) => p.node.sku === (item.data.sku || item.parent_sku)).node.prices.price.value,
                    basePrice: data.site.product.variants.edges.find((p) => p.node.sku === (item.data.sku || item.parent_sku)).node.prices.basePrice.value,
                    name: item.data.sku ? `${data.site.product.name} ${data.site.product.variants.edges.find((p) => p.node.sku === item.data.sku).node.options.edges.map(
                        (attribute: any) => attribute.node.values.edges[0].node.label
                    )}` : data.site.product.name
                };
            })
        );

        products.forEach((prod: any) => {
            totalPrice = totalPrice + prod.price * prod.quantity;
            totalQty = totalQty + prod.quantity;
        });

        const { data: quoteCreated } = await restClient(`/api/v3/io/rfq`, {
            method: 'POST',
            headers: {
                backendTechnology: 'bigcommerceb2b'
            },
            body: JSON.stringify({
                message: 'testing from B2BStore',
                grandTotal: totalPrice.toFixed(2),
                discount: 0,
                subtotal: totalPrice.toFixed(2),
                userEmail: 'dgonzalez@orienteed.com',
                quoteTitle: 'testingAPIquote',
                expiredAt: localExpiredAt,
                contactInfo: {
                    name: 'David',
                    email: 'dgonzalez@orienteed.com',
                    companyName: 'Orienteed',
                    phoneNumber: '123456789'
                },
                productList: products.map((prod: any) => ({
                    sku: prod.sku,
                    basePrice: prod.basePrice,
                    discount: 0.0,
                    offeredPrice: prod.price,
                    quantity: prod.quantity,
                    productId: prod.entityId,
                    variantId: prod.variantId,
                    imageUrl: prod.image,
                    productName: prod.name
                })),
                channelId: 1
            })
        });

        const { data: quoteData } = await restClient(`/api/v3/io/rfq/${quoteCreated.quoteId}`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerceb2b'
            }
        });

        parsedData = addConfigurableProductsToQuoteParser(quoteData, quoteCreated.quoteId, totalQty);

        return { data: parsedData };
    };

    return { addConfigProductToQuote };
};

export default AddConfigurableProductsToQuote;
