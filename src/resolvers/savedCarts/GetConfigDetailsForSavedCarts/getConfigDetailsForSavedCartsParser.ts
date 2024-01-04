import { GetConfigDetailsForSavedCartsQuery } from '@schema';

export const getConfigDetailsForSavedCartsParser = (): GetConfigDetailsForSavedCartsQuery => {
    return {
        mpSaveCartConfigs: {
            __typename: 'MpSaveCartConfigsOutput',
            allow_share: 1,
            button_title: 'Save Cart',
            enabled: 1,
            show_button_guest: 0
        }
    }
};
