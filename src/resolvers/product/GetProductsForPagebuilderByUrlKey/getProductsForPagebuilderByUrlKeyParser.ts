import { GetProductsForPagebuilderByUrlKeyQuery } from '@schema';

export const getProductsForPagebuilderByUrlKeyParser = (data: any): GetProductsForPagebuilderByUrlKeyQuery => {
    const getFilters = () => {
        let filters = [];
        let allCat = [];
        let allOpt = [];

        filters.push({
            __typename: 'LayerFilter',
            name: 'Category', // TODO_B2B: Place the correct name for category filter
            request_var: 'category', // TODO_B2B: Check how request_vars are used and place the correct value
            filter_items: null
        });

        for (const element of data) {
            for (const category of element.node.categories.edges) {
                allCat.push({
                    label: category.node.name,
                    value_string: category.node.name
                });
            }
        }

        let uniqueCategories = allCat
            .map((e) => e['label']) // returns an array with only the ids
            .map((e, i, final) => final.indexOf(e) === i && i) // saves the indexes of the unique elements
            .filter((e) => allCat[e]) // deletes the undefined and wrong indexes
            .map((e) => allCat[e]); // returns the final array

        filters[0].filter_items = uniqueCategories;

        data.map((item) =>
            item.node.productOptions.edges.map((attribute) =>
                attribute.node.isVariantOption
                    ? allOpt.indexOf({ name: attribute.node.displayName }) != -1 &&
                      allOpt[allOpt.indexOf({ name: attribute.node.displayName })].filter_items
                        ? allOpt[allOpt.indexOf({ name: attribute.node.displayName })].filter_items.push(
                              //   attribute.node.values ?
                              attribute.node.values.edges.map((value) => ({
                                  label: value.node.label,
                                  value_string: value.node.entityId
                              }))
                              //   : []
                          )
                        : allOpt.push({
                              __typename: 'LayerFilter',
                              name: attribute.node.displayName,
                              filter_items_count: attribute.values ? attribute.values.edges.length : 0,
                              request_var: attribute.node.displayName, // TODO_B2B: Check how request_vars are used and place the correct value
                              filter_items: attribute.node.values
                                  ? attribute.node.values.edges.map((value) => ({
                                        label: value.node.label,
                                        value_string: value.node.entityId
                                    }))
                                  : null
                          })
                    : null
            )
        );

        for (const element of allOpt) {
            if (element.filter_items) {
                element.filter_items
                    .map((e) => e['label']) // returns an array with only the ids
                    .map((e, i, final) => final.indexOf(e) === i && i) // saves the indexes of the unique elements
                    .filter((e) => allCat[e]) // deletes the undefined and wrong indexes
                    .map((e) => allCat[e]); // returns the final array
            }
            filters.push(element);
        }

        return filters;
    };

    return {
        products: {
            items: data.map((item: any) => ({
                __typename: 'ConfigurableProduct',
                uid: item.node.entityId.toString(),
                id: item.node.entityId,
                name: item.node.name,
                url_suffix: '.html',
                price_range: {
                    maximum_price: {
                        regular_price: {
                            currency: item.node.prices.priceRange.max.currencyCode,
                            value: item.node.prices.priceRange.max.value
                        }
                    }
                },
                price: {
                    regularPrice: {
                        amount: {
                            currency: item.node.prices.price.currencyCode,
                            value: item.node.prices.price.value
                        }
                    },
                    minimalPrice: {
                        amount: {
                            currency: item.node.prices.priceRange.min.currencyCode,
                            value: item.node.prices.priceRange.min.value
                        }
                    }
                },
                sku: item.node.sku,
                small_image: {
                    __typename: 'ProductImage',
                    url: item.node.images.edges[0].node.url
                },
                // @ts-ignore // Ignore stock_status type error because we cannot import ProductStockStatus enum from the schema
                stock_status: item.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                url_key: item.node.path.slice(1, -1)
            })),
            total_count: data.length,
            filters: getFilters()
        }
    };
};
