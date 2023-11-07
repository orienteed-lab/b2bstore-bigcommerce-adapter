export const setCustomerAddressIdOnCartParser = (data: any, checkout: any) => {
    
    const getItems = () => {
        let items = [];
        if (checkout.cart.line_items.physical_items.length !== 0) {
            checkout.cart.line_items.physical_items.map((item) => items.push({
                item_id: item.id,
                quantity: item.quantity
            }))
        };

        return items;
    }

    return [
        {
            address: {
                first_name: data.first_name,
                last_name: data.last_name,
                address1: data.address1,
                address2: data.address2,
                city: data.city,
                country: data.country,
                email: checkout.cart.email,
                phone: data.phone,
                company: data.company,
                country_code: data.country_code,
                postal_code: data.postal_code,
                state_or_province: data.state_or_province
            },
            line_items: getItems()
        }
    ];
};
