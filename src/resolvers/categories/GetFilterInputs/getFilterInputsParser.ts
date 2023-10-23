import { GetFilterInputsQuery } from '@schema';

export const getFilterInputsParser = (data: any): GetFilterInputsQuery => {
    return {
        __type: {
            __typename: '__Type',
            inputFields: data.site.search.searchProducts.filters.edges.map((input: any) => ({
                __typename: '__InputValue',
                name: input.node.__typename === 'CategorySearchFilter' ? 'category_id' : (input.node.filterName ? input.node.filterName : input.node.name),
                type: {
                    __typename: '__Type',
                    name: 'FilterEqualTypeInput' //TODO_B2B: It doesn't exist in BigCommerce
                }
            }))
        }
    };
};
