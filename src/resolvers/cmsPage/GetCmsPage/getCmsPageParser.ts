import { GetCmsPageQuery } from '@schema';

export const getCmsPageParser = (data: any, identifier: any): GetCmsPageQuery => {
    return {
        cmsPage: {
            url_key: identifier,
            content: data.site.content.page.htmlBody, //TODO: htmlBody just returns the body, inject <style> tags
            content_heading: data.site.content.page.name, //In bigcommerce storefront, the page name and content_heading are the same 
            title: data.site.content.page.name,
            page_layout: "1column", //TODO: obtain its BigCommerce equivalent, magento description: The design layout of the page, indicating the number of columns and navigation features used on the page.
            meta_title: data.site.content.page.seo.pageTitle,
            meta_keywords: data.site.content.page.seo.metaKeywords,
            meta_description: data.site.content.page.seo.metaDescription
        }
    };
};
