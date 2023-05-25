import { GetCategoryDataQuery } from '@schema';

export const getCategoryDataParser = (data: any): GetCategoryDataQuery => {
    const getItems = (uid: any) => {
        var items = [];
        const p = data.site.search.searchProducts.products.edges;
        for (let i = 0; i < p.length; i++) {
            p[i].node.categories.edges
                .map((category: any) => (uid === category.node.entityId ? items.push(p[i]) : null))
                .filter((option: any) => option !== null);
        }
        return items;
    };

    return {
        categories: {
            items: data.site.categoryTree.map((tree: any) => ({
                children_count: data.site.categoryTree.length,
                description: tree.description,
                include_in_menu: 1, //TODO_B2B: Review, Magente always give it a 1
                name: tree.name,
                uid: tree.entityId,
                url_key: tree.path,
                url_path: tree.path,
                children: tree.children
                    ? tree.children.map((child: any) => ({
                          children_count: tree.children.length,
                          image: child.urlOriginal,
                          include_in_menu: 1, //TODO_B2B: Review, Magente always give it a 1
                          name: child.name,
                          path: child.path,
                          position: 10, //TODO_B2B: Review, it doens't have an equivalent in BigCommerce
                          uid: child.entityId,
                          url_key: child.path,
                          url_path: child.path,
                          url_suffix: '', // BigCommerce doesn't have suffixs
                          productImagePreview: {
                              items: getItems(child.entityId).map((item: any) => ({
                                  uid: item.node.entityId,
                                  small_image: {
                                      url: item.node.images.edges[0].node.urlOriginal
                                  }
                              }))
                          }
                      }))
                    : []
            }))
        }
    };
};
