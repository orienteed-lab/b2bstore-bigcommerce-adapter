import { gql } from '@apollo/client';

//Query to retrieve actual storefront URL
export const APPLY_GIFT_CARD_TO_CART = gql`
{
  site{
    settings{
      url{
        vanityUrl
      }
    }
  }
}
`;

export default {
  /*
  TODO: this mutation is used by app/packages/peregrine/lib/talons/CartPage/GiftCards/useGiftCards.js (when you click on the cart and 
  you have the posibility to apply a gift card number). 
  Go to useGiftCards.js and replace the useMutation by direct resolver function call (applyGiftCardToCart)
  */
    applyGiftCardToCartMutation: APPLY_GIFT_CARD_TO_CART
};
