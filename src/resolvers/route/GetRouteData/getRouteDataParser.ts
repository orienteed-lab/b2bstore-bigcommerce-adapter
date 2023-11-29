import { GetRouteDataQuery } from '@schema';

export const getRouteDataParser = (data: any, path: any): GetRouteDataQuery => {
    if (path === '/') { // It's the Home page
        return {
            route: {
                __typename: 'CmsPage',
                relative_url: 'home'
            }
        };
    } else {
        return {
            route: data.site.route.node.__typename === 'Category' ? { // It's a category
                __typename: 'CategoryTree',
                relative_url: `${data.site.route.node.path.slice(1, -1)}.html`,
            } : data.site.route.node.productOptions.edges.length !== 0 ? { // It's a configurable product
                __typename: 'ConfigurableProduct',
                relative_url: `${data.site.route.node.path.slice(1, -1)}.html`,
            } : null // It's a simple product (the URL is generated in other way)
        }
    }
};
