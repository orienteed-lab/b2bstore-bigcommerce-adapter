import { GetAppliedCouponsQuery } from '@schema';

export const getAppliedCouponsParser = ({ data }: any): GetAppliedCouponsQuery => {
    return {
        cart: {
            id: data.id,
            applied_coupons:
                data.coupons.length !== 0
                    ? data.coupons.map((coupon: any) => ({
                          __typename: 'AppliedCoupon',
                          code: coupon.code
                      }))
                    : null
        }
    };
};
