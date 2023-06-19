import { GetWishlistProductsQuery } from '@schema';
import { setOrderAttributesParser } from 'src/resolvers/orderAttributes/SetOrderAttributes/setOrderAttributesParser';

export const getWishlistProductsParser = (productData: any, variantData: any): GetWishlistProductsQuery => {
    return {
        customer: {
            wishlist_v2: {
                id: productData.customer.wishlists.edges[0].node.entityId,
                items_v2: {
                    items: productData.customer.wishlists.edges[0].node.items.edges.map((item: any) => ({
                        id: item.node.product.entityId,
                        configurable_options: variantData.site.products.edges.map((product: any) =>
                            product.node.variants.edges.map((variant: any) =>
                                variant.node.options.edges.map((attribute: any) => ({
                                    id: attribute.node.entityId,
                                    option_label: '',
                                    value_id: '', //TODO_B2B: See if there is an equivalent
                                    value_label: '' //TODO_B2B: See if there is an equivalent
                                }))
                            )
                        ),
                        product: {
                            uid: item.node.product.entityId,
                            orParentSku: item.node.product.sku,
                            image: {
                                label: item.node.product.name,
                                url: item.node.product.images.edges[0].node.urlOriginal
                            },
                            name: item.node.product.name,
                            price: {
                                regularPrice: {
                                    amount: {
                                        currency: item.node.product.prices.price.currencyCode,
                                        value: item.node.product.prices.price.value
                                    }
                                },
                                minimalPrice: {
                                    amount: {
                                        currency: item.node.product.prices.priceRange.min.currencyCode,
                                        value: item.node.product.prices.priceRange.min.value
                                    }
                                }
                            },
                            price_range: {
                                maximum_price: {
                                    final_price: {
                                        currency: item.node.product.prices.priceRange.max.currencyCode,
                                        value: item.node.product.prices.priceRange.max.value
                                    }
                                }
                            },
                            sku: item.node.product.sku,
                            // @ts-ignore // Ignore stock_status type error because we cannot import ProductStockStatus enum from the schema
                            stock_status: item.node.product.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                            url_key: item.node.product.path,
                            url_suffix: '',

                            variants: variantData.site.products.edges.map((product: any) =>
                                product.node.variants.edges.map((variant: any) => ({
                                    attributes: variant.node.options.edges.map((attribute: any) => ({
                                        uid: attribute.node.entityId,
                                        code: attribute.node.values.edges[0].node.label, //TODO_B2B: See if there is an equivalent
                                        value_index: attribute.node.values.edges[0].node.entityId, //TODO_B2B: See if there is an equivalent
                                        label: attribute.node.displayName //TODO_B2B: See if exists
                                    })),
                                    product: {
                                        stock_status: variant.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                                        id: variant.node.id,
                                        uid: variant.node.entityId,
                                            small_image: {
                                                url: variant.node.defaultImage ?  variant.node.defaultImage.urlOriginal : ''
                                            },
                                            thumbnail: {
                                                url: product.node.path //añadirlo al graphql
                                            },

                                        configurable_options: variant.node.options.edges.map((option: any) => ({
                                            uid: option.node.entityId,
                                            attribute_code: option.node.displayName, //TODO_B2B: is the displayName the attribute_code?
                                            attribute_id: option.node.entityId,
                                            attribute_id_v2: '',
                                            label: option.node.name,
                                            values: option.node.values.edges.map((v: any) => ({
                                                uid: v.node.entityId,
                                                default_label: v.node.name,
                                                label: v.node.name,
                                                store_label: v.node.name, //TODO_B2B: See if there is an equivalent
                                                use_default_value: '',
                                                value_index: '',
                                                swatch_data: {
                                                    //... on ImageSwatchData: {
                                                    thumbnail: '',
                                                    // }
                                                    value: ''
                                                }
                                            }))
                                        }))
                                    }
                                }))
                            )
                        }
                    }))
                }
                //                     },
                //                     // ... on SimpleProduct {
                //                     //     custom_attributes {
                //                     //         selected_attribute_options {
                //                     //             attribute_option {
                //                     //                 label
                //                     //             }
                //                     //         }
                //                     //     }
                //                     // }
                //                 },
                //             
            }
        }
    };
};
