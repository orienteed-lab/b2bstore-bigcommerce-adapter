import { GetMegaMenuQuery } from '@schema';

export const getMegaMenuParser = (data: any): GetMegaMenuQuery => {
    
    return {
        categoryList: [{
            uid: '',
            name: 'Default category',
            children: data.site.categoryTree.map((category: any, index1) => ({
                uid: category.entityId,
                include_in_menu: 1, //TODO_B2B: Review, in magento apperars always with a 1
                name: category.name,
                category_icon: category.image ? category.image.urlOriginal : '',
                position: index1+1, //TODO_B2B: Review, it doens't have an equivalent in BigCommerce
                url_path: category.path.slice(1, -1),
                children: category.children.length !== 0 ? category.children.map((child: any, index2) => ({
                    uid: child.entityId,
                    include_in_menu: 1, //TODO_B2B: Review, in magento apperars always with a 1
                    name: child.name,
                    category_icon: child.image ? child.image.urlOriginal : '',
                    position: index2+1, //TODO_B2B: Review, it doens't have an equivalent in BigCommerce
                    url_path: child.path.slice(1, -1),
                    children: child.children.length !== 0 ? child.children.map((child2: any, index3) => ({
                        uid: child2.entityId,
                        include_in_menu: 1, //TODO_B2B: Review, in magento apperars always with a 1
                        name: child2.name,
                        category_icon: child2.image ? child2.image.urlOriginal : '',
                        position: index3+1, //TODO_B2B: Review, it doens't have an equivalent in BigCommerce
                        url_path: child2.path.slice(1, -1),
                    })) : []
                })) : []
            }))
        }]
    };
};
