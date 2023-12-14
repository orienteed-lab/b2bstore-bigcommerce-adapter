import { GetQuoteListQuery } from '@schema';

export const getQuoteListParser = (data: any, meta: any, quotesData: any, pageSize: any, currentPage: any): GetQuoteListQuery => {
    const status = {
        0: 'pending',
        2: 'pending',
        3: 'pending'
    };

    return {
        mpQuoteList: {
            page_info: {
                current_page: currentPage,
                page_size: pageSize,
                total_pages: Math.floor(meta.pagination.totalCount / pageSize) + 1
            },
            items: data.map((quote, index) => ({
                created_at: quote.createdAt*1000,
                quote_currency_code: quote.currency.currencyCode,
                status: status[quote.status],
                subtotal: quote.subtotal,
                entity_id: quote.quoteId,
                expired_at: quote.expiredAt*1000,
                discount: quotesData[index].discount,
                items: quotesData[index].productList.map((product) => ({
                    name: product.productName,
                    sku: product.sku,
                    request_price: product.offeredPrice,
                    qty: product.quantity,
                    discount: `${product.discount}%`,
                    prices: {
                        total_item_discount: {
                            currency: quotesData[index].currency.currencyCode,
                            value: product.discount
                        },
                        row_total: {
                            currency: quotesData[index].currency.currencyCode,
                            value: product.basePrice
                        },
                        price: {
                            currency: quotesData[index].currency.currencyCode,
                            value: product.basePrice
                        }
                    },
                    configurable_options:
                        product.options.length !== 0
                            ? product.options.map((option) => ({
                                  id: option.optionId,
                                  option_label: option.optionName,
                                  value_id: option.optionValue,
                                  value_label: option.optionLabel
                              }))
                            : []
                }))
            }))
        }
    };
};
