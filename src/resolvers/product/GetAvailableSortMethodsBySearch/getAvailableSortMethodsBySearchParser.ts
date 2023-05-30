import { GetAvailableSortMethodsBySearchQuery } from '@schema';

export const getAvailableSortMethodsBySearchParser = (data: any): GetAvailableSortMethodsBySearchQuery => {
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
                      "value": "name"
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
