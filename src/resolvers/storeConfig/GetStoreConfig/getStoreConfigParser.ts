import { GetStoreConfigQuery } from '@schema';

export const getStoreConfigParser = (locale: any, configData: any): GetStoreConfigQuery => {
    return {
        storeConfig: {
            __typename: "StoreConfig",
            store_code: "default",
            product_url_suffix: ".html",
            magento_wishlist_general_is_enabled: "1", // Cannot be obtained by the API (env?)
            configurable_thumbnail_source: "itself",
            category_url_suffix: ".html",
            locale: locale.data.default_shopper_language, // TODO_B2B: Check if it's possible to change anguage in one channel
            grid_per_page: 12, // TODO_B2B: GET (env?)
            store_name: configData.site.settings.storeName,
            bank_transfer: {
                __typename: "ExtraInfoBankTransferPayment",
                instructions: "These instructions are being filled from Magento" // TODO_B2B: GET (Maybe)
            },
            allow_order: null,
            contact_enabled: !!(configData.site.settings.contact.email || configData.site.settings.contact.phone),
            copyright: "Copyright © 2013-present Magento, Inc. All rights reserved.",
            is_required_login: "1", // TODO_B2B: GET
            newsletter_enabled: true, // TODO_B2B: GET (env?)
            root_category_uid: configData.site.categoryTree[0].entityId,
            store_group_name: "Main Website Store"
        }
    };
};
