import { GetBreadcrumbsQuery } from '@schema';

export const getBreadcrumbsParser = (data: any): GetBreadcrumbsQuery => {
    
    return {
        categories: {
            items: [{
                uid: data.site.category.entityId,
                name: data.site.category.name,
                url_path: data.site.category.path.slice(1, -1),
                breadcrumbs: data.site.category.breadcrumbs.edges.map((breadcrumb: any, index)  => (
                    index<(data.site.category.breadcrumbs.edges.length-1) ? {
                    __typername: 'Breadcrumb',
                    category_uid: breadcrumb.node.category_uid,
                    category_level: data.site.category.breadcrumbs.edges.length, 
                    category_name: breadcrumb.node.name,
                    category_url_path: breadcrumb.node.path.slice(1)
                    }: null
                )).filter((option: any) => option !== null)
            }]
        }
    };
};
