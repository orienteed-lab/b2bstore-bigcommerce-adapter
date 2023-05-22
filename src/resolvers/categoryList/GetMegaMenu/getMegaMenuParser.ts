import { GetMegaMenuQuery } from '@schema';
import { categoryFromCategoryConfig } from 'emoji-picker-react/dist/config/categoryConfig';

export const getMegaMenuParser = (data: any): GetMegaMenuQuery => {
    
    return {
        categoryList: data.site.categoryTree.map((category: any) => ({
            uid: category.entityId,
            name: category.name,
            children: category.children.map((child: any) => ({
                uid: child.entityId,
                include_in_menu: 1, //TODO_B2B: Review, in magento apperars always with a 1
                name: child.name,
                category_icon: child.image.urlOriginal,
                position: 9, //TODO_B2B: Review, it doens't have an equivalent in BigCommerce
                url_path: child.path,
                children: child.children.map((child2: any) => ({
                    uid: child2.entityId,
                    include_in_menu: 1, //TODO_B2B: Review, in magento apperars always with a 1
                    name: child2.name,
                    category_icon: child2.image.urlOriginal,
                    position: 9, //TODO_B2B: Review, it doens't have an equivalent in BigCommerce
                    url_path: child2.path,
                    children: child2.children.map((child3: any) => ({
                        uid: child3.entityId,
                        include_in_menu: 1, //TODO_B2B: Review, in magento apperars always with a 1
                        name: child3.name,
                        category_icon: child3.image.urlOriginal,
                        position: 9, //TODO_B2B: Review, it doens't have an equivalent in BigCommerce
                        url_path: child3.path,
                    }))
                }))
            }))
        }))
    };
};
