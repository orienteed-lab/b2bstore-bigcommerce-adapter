import { AddConfigurableProductsToQuoteMutation } from '@schema';

export const addConfigurableProductsToQuoteParser = (data: any, quoteId: any, totalQty: any): AddConfigurableProductsToQuoteMutation => {''
    return {
        addConfigurableProductsToMpQuote: {
            quote: {
                base_currency_code: data.currency.currencyCode,
                base_subtotal: data.subtotal,
                created_at: (data.createdAt*1000).toString(),
                customer_email: data.contactInfo.email,
                entity_id: quoteId,
                items_count: data.productList.length,
                items_qty: totalQty.toString(),
                subtotal: data.totalAmount,
                quote_currency_code: data.currency.currencyCode,
                items: data.productList.map(prod => ({
                    id: prod.productId,
                    quote_id: prod.productId,
                    sku: prod.sku,
                    qty: prod.quantity,
                    name: prod.productName,
                    prices: {
                        row_total: {
                            currency: data.currency.currencyCode,
                            value: prod.basePrice
                        }
                    },
                    product: {
                        name: prod.productName,
                        uid: prod.productId,
                        url_key: prod.productUrl.slice(1, -1),
                        url_suffix: '.html',
                        thumbnail: {
                            url: prod.imageUrl
                        }
                    },
                        configurable_options: prod.options.length !== 0 ? prod.options.map(opt => ({
                            id: opt.optionId,
                            option_label: opt.optionName,
                            value_id: opt.optionValue,
                            value_label: opt.optionLabel
                        })) : []
                }))
            }
        }
    }
};
