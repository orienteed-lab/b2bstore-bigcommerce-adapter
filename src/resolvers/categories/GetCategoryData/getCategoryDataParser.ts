import { GetCategoryDataQuery } from '@schema';

export const getCategoryDataParser = (data: any): GetCategoryDataQuery => {
    const getItems = (uid: any) => {
        const items = [];
        const products = data.site.search.searchProducts.products.edges;
        for (const element of products) {
            element.node.categories.edges
                .map((category: any) => (uid === category.node.entityId ? items.push(element) : null))
                .filter((option: any) => option !== null);
        }
        return items
    };

    return {
        categories: {
            items: data.site.categoryTree.map((tree: any) => ({
                children_count: data.site.categoryTree.length.toString(),
                description: tree.description,
                include_in_menu: 1, //TODO_B2B: Review, Magento always give it a 1
                name: tree.name,
                uid: tree.entityId.toString(),
                url_key: tree.path.slice(1, -1),
                url_path: tree.path.slice(1, -1),
                children: tree.children.length !== 0 ? tree.children.map((category: any) => ({
                    children_count: category.children.length.toString(),
                    image: category.urlOriginal,
                    include_in_menu: 1, //TODO_B2B: Review, Magento always give it a 1
                    name: category.name,
                    path: `1/1/${tree.entityId}/${category.entityId}`,
                    position: 1, //TODO_B2B: Review, it doens't have an equivalent in BigCommerce
                    uid: category.entityId.toString(),
                    url_key: category.path.slice(1, -1),
                    url_path: `${tree.path.slice(1, -1)}/${category.path.slice(1, -1)}`,
                    url_suffix: '.html', // BigCommerce doesn't have suffixs
                    productImagePreview: {
                        items: getItems(category.entityId).map((item: any) => ({
                            uid: item.node.entityId,
                            small_image: {
                                url: item.node.images.edges.length !== 0 ? item.node.images.edges[0].node.urlOriginal : null
                            }
                        }))
                    }
                })) : []
            }))
        }
    };
};
