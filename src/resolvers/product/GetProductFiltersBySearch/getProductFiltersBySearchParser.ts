import { GetProductFiltersBySearchQuery } from '@schema';

export const getProductFiltersBySearchParser = (data: any): GetProductFiltersBySearchQuery => {
    const total_quantity_category = () => {
        var total = 0;
        data.site.search.searchProducts.filters.edges.map((item: any) => {
            if (item.node.__typename === 'CategorySearchFilter') {
                item.node.categories.edges
                    .map((option: any) => {
                        total = total + 1;
                    })
                    .filter((option: any) => option !== null);
            }
        });
        return total;
    };
    const total_quantity_brand = () => {
        var total = 0;
        data.site.search.searchProducts.filters.edges.map((item: any) => {
            if (item.node.__typename === 'BrandSearchFilter') {
                item.node.brands.edges.map((option: any) => {
                    total = total + 1;
                });
            }
        });
        return total;
    };
    const total_quantity_product = () => {
        var total = 0;
        data.site.search.searchProducts.filters.edges.map((item: any) => {
            if (item.node.__typename === 'ProductAttributeSearchFilter') {
                item.node.attributes.edges.map((option: any) => {
                    total = total + 1;
                });
            }
        });
        return total;
    };

    const getItems = () => {
        var items = [];
        data.site.search.searchProducts.filters.edges
            .map((item: any) => {
                item.node.__typename === 'CategorySearchFilter'
                    ? items.push({
                          label: item.node.name,
                          count: total_quantity_category(),
                          attribute_code: item.node.__typename,
                          options: item.node.categories.edges
                              .map((option: any) =>
                                  option.node.name !== ''
                                      ? {
                                            label: option.node.name,
                                            value: option.node.entityId
                                        }
                                      : null
                              )
                              .filter((option: any) => option !== null)
                      })
                    : null,
                    item.node.__typename === 'BrandSearchFilter'
                        ? items.push({
                              label: item.node.name,
                              count: total_quantity_brand(),
                              attribute_code: item.node.name,
                              options: item.node.brands.edges.map((option: any) => ({
                                  label: option.node.name,
                                  value: option.node.entityId
                              }))
                          })
                        : null,
                    item.node.__typename === 'OtherSearchFilter'
                        ? items.push({
                              label: item.node.name,
                              count: 0, //It can't have any options
                              attribute_code: item.node.name,
                              options: []
                          })
                        : null,
                    item.node.__typename === 'PriceSearchFilter'
                        ? items.push({
                              label: item.node.name,
                              count: 0, //It can't have any options
                              attribute_code: item.node.name,
                              options: []
                          })
                        : null,
                    item.node.__typename === 'SearchProductFilter'
                        ? items.push({
                              label: item.node.name,
                              count: 0, //It can't have any options
                              attribute_code: item.node.name,
                              options: []
                          })
                        : null,
                    item.node.__typename === 'ProductAttributeSearchFilter'
                        ? items.push({
                              label: item.node.name,
                              count: total_quantity_product(),
                              attribute_code: item.node.filterName,
                              options: item.node.attributes.edges.map((option: any) => ({
                                  label: option.node.value,
                                  value: option.node.value
                              }))
                          })
                        : null;
            })
            .filter((option: any) => option !== null);

        return items;
    };

    return {
        products: {
            aggregations: getItems()
        }
    };
};
