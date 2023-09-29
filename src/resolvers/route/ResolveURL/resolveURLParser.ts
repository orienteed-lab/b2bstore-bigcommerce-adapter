import { ResolveUrlQuery } from '@schema';

export const resolveURLParser = (data: any, path: any) => {
    if (path === '/') { // It's the Home page
        return {
            route: {
                __typename: 'CmsPage',
                relative_url: 'home',
                redirect_code: 0,
                type: "CMS_PAGE",
                identifier: 'home'
            }
        };
    } else {
        return {
            route: data.site.route.node.__typename === 'Category' ? { // It's a category
                __typename: 'CategoryTree',
                relative_url: `${data.site.route.node.path.slice(1, -1)}.html`,
                redirect_code: 0,
                type: 'CATEGORY',
                uid: data.site.route.node.entityId.toString()
            } : data.site.route.node.productOptions.edges.length !== 0 ? { // It's a configurable product
                __typename: 'ConfigurableProduct',
                relative_url: `${data.site.route.node.path.slice(1, -1)}.html`,
                redirect_code: 0,
                type: 'PRODUCT',
                uid: data.site.route.node.entityId.toString()
            } : null // It's a simple product (the URL is generated in other way)
        }
    }
};
