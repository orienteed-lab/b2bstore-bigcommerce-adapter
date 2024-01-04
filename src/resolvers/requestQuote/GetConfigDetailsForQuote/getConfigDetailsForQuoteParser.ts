import { GetConfigDetailsForQuoteQuery } from '@schema';

export const getConfigDetailsForQuoteParser = (data: any): GetConfigDetailsForQuoteQuery => {
    return {
        mpQuoteConfig: {
            __typename: 'mpQuoteConfigOutput',
            allow_category: '',
            category: '',
            customer_groups: '',
            file_type: '',
            icon_url: '',
            is_allow_attach: true,
            is_allow_guest: false,
            redirect_page: ''
        }
    }
};
