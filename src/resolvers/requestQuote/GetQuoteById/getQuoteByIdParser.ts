import { GetQuoteByIdQuery } from '@schema';

export const getQuoteByIdParser = (data: any, quote_id: any): GetQuoteByIdQuery => {
    return {
        mpQuote: {
            quote: {
                base_currency_code: data.currency.currencyCode,
                base_subtotal: data.subtotal,
                created_at: (data.createdAt*1000).toString(),
                customer_email: data.contactInfo.email,
                entity_id: quote_id,
                items_count: data.productList.length,
                items_qty: '',
                subtotal: data.grandTotal,
                quote_currency_code: data.currency.currencyCode,
                items: data.productList.map((prod) => ({
                    id: prod.productId,
                    quote_id: quote_id,
                    sku: prod.sku,
                    qty: prod.quantity,
                    name: prod.name,
                    prices: {
                        row_total: {
                            currency: data.currency.currencyCode,
                            value: prod.offeredPrice
                        }
                    },
                    product: {
                        name: prod.productName,
                        url_key: prod.productUrl.slice(1, -1),
                        url_suffix: '.html',
                        thumbnail: {
                            url: prod.imageUrl
                        }
                    },
                    configurable_options: prod.options.length !== 0 ? prod.options.map((opt) => ({
                        id: opt.optionId,
                        option_label: opt.optionName,
                        value_id: opt.optionValue,
                        value_label: opt.optionLabel
                    })) : []
                }))
            }
        }
    };
};
