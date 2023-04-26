import { GetProductAggregationsFilteredByCategoryQuery } from '@schema';

export function getProductAggregationsFilteredByCategoryParser(data: any): GetProductAggregationsFilteredByCategoryQuery {
    var pos = 0;
    return {
        products: {
            __typename: 'Products',
            aggregations: data.site.search.searchProducts.filters ? data.site.search.searchProducts.filters.edges.map((filter: any) => ({
                __typename: 'Aggregation',
                label: filter.node.name,
                count: filter.node.categories ? filter.node.categories.edges.length : (filter.node.attributes ? filter.node.attributes.edges.length : 0),
                attribute_code: filter.node.name,
                options: filter.node?.categories ? filter.node.categories.edges.map((category: any) => ({
                    __typename: 'AggregationOption',
                    label: category.node.name,
                    value: category.node.entityId
                })) : (filter.node.attributes ? filter.node.attributes.edges.map((attribute: any) => ({
                    __typename: 'AggregationOption',
                    label: attribute.node.value,
                    value: attribute.node.value
                })): []),
                position: filter.node.categories ? null : pos = pos+100
            })): []
        }
    };
}
