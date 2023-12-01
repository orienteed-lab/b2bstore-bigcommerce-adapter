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
    applyGiftCardToCartMutation: APPLY_GIFT_CARD_TO_CART
};
