import { SetBillingAddressMutation } from '@schema';

export const setBillingAddressParser = (data: any, paymentMethodData: any): SetBillingAddressMutation => {
    // Your parser logic here
    //console.log("DATOS SETBILLING A PARSEAR: ", data)
    //console.log("Payment method Data: ", paymentMethodData)

    const getItems = () => {
        var items = [];
    
        if (data.cart.line_items.physical_items) {
            data.cart.line_items.physical_items.forEach((item) => {
                items.push(createCartItem(item));
            });
        }
    
        if (data.cart.line_items.digital_items) {
            data.cart.line_items.digital_items.forEach((item) => {
                items.push(createCartItem(item));
            });
        }
    
        if (data.cart.line_items.custom_items) {
            data.cart.line_items.custom_items.forEach((item) => {
                items.push(createCartItem(item));
            });
        }
    
        return items;
    };

    
    const createCartItem = (item) => {
        return {
            __typename: 'SimpleCartItem',
            uid: item.id,
            quantity: item.quantity,
        };
    };

    const getTaxes = () => {
        if (!data.taxes) {
            return null;
          }
        
          var taxes = [];
          data.taxes.forEach((tax) => {
            taxes.push(createTaxes(tax));
          });
        
          return taxes;
    };

    const createTaxes = (tax) => {
    
        return {
            __typename: 'CartTaxItem',
            amount:{
                __typename: 'Money',
                currency:data.cart.currency.code,
                value: tax.amount
            }
        }
    };

    const getPaymentMethods = () => {
        if (!paymentMethodData.data) {
            return null;
          }
        
          var paymentMethods = [];
          paymentMethodData.data.forEach((paymentMethod) => {
            console.log("Payment method: ", paymentMethod);
            paymentMethods.push(paymentMethod);
          });
        
          return paymentMethods;
    };

    const createDiscounts = (discount) => {
    
        return {
            __typename: 'Discount',
            label: discount.id,
            amount:{
                __typename: 'Money',
                currency: data.cart.currency.code !== null ? data.cart.currency.code : null,
                value: discount.discounted_amount !== null ? discount.discounted_amount : null
            }
        }
    };

    const getDiscounts = () => {
        if (!data.cart.discounts) {
          return null;
        }
      
        var discounts = [];
        data.cart.discounts.forEach((discount) => {
          console.log("Discount: ", discount);
          discounts.push(createDiscounts(discount));
        });
      
        return discounts;
      };

    const createGiftCards = (giftCard) => {
    
        return {
            __typename: 'AppliedGiftCard',
            code: giftCard.id !== null ? giftCard.id : null,
            applied_balance:{
                __typename: 'Money',
                value: giftCard.discounted_amount !== null ? giftCard.discounted_amount : null,
                currency: data.cart.currency.code !== null ? data.cart.currency.code : null
            }
        }
    };

    const getGiftCards = () => {
        if (!data.cart.line_items.gift_certificates) {
            console.log("Not gift cards, return null")
          return null;
        }
      
        var giftCards = [];
        data.cart.line_items.gift_certificates.forEach((giftCard) => {
          console.log("GiftCard: ", giftCard);
          giftCards.push(createGiftCards(giftCard));
        });
      
        return giftCards;
      };

    return {
        setBillingAddressOnCart: {
            __typename: 'SetBillingAddressOnCartOutput',
            cart : {
                __typename: 'Cart',
                id: data.cart.id,
                billing_address: {
                    __typename: 'BillingCartAddress',
                    firstname: data.billing_address.first_name,
                    lastname: data.billing_address.last_name,
                    street: [data.billing_address.address1, data.billing_address.address2],
                    city: data.billing_address.city,
                    postcode: data.billing_address.postal_code,
                    telephone: data.billing_address.phone,
                    country: {
                        __typename: 'CartAddressCountry',
                        code: data.billing_address.country_code,
                    },
                    region: {
                        __typename:'CartAddressRegion',
                        code: data.billing_address.state_or_province_code
                    }
                },
                items: getItems(),
                prices: {
                    __typename: 'CartPrices',
                    subtotal_excluding_tax: {
                        __typename: 'Money',
                        currency: data.cart.currency.code,
                        value: data.cart.cart_amount_ex_tax

                    },
                    subtotal_including_tax: {
                        __typename: 'Money',
                        currency: data.cart.currency.code,
                        value: data.cart.cart_amount_inc_tax
                    },
                    gift_options: {
                        __typename: 'GiftOptionsPrices',
                        printed_card: {
                            __typename: 'Money',
                            value: 12,
                            currency: data.cart.currency.code, 
                        }
                    },
                    applied_taxes: getTaxes(),
                    discounts: getDiscounts(),
                    grand_total: {
                        __typename: 'Money',
                        currency: data.cart.currency.code,
                        value: data.grand_total !== null ? data.grand_total : null
                    }
                },
                available_payment_methods: getPaymentMethods(), //TODO
                shipping_addresses: null, //TODO
                applied_gift_cards: getGiftCards() //TODO
            }
        }
    };
};
