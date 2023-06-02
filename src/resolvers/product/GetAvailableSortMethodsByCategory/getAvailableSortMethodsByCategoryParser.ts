import { GetAvailableSortMethodsByCategoryQuery } from '@schema';

export const getAvailableSortMethodsByCategoryParser = (data: any): GetAvailableSortMethodsByCategoryQuery => {
    return {
        products: {
            sort_fields: {
                options: [
                    {
                      label: "Position",
                      value: "position"
                    },
                    {
                      label: "Product name",
                      value: "name"
                    },
                    {
                      label: "Price",
                      value: "price"
                    }
                  ]
            }
        }
    };
};
