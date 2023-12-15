import { GetCmsPageQuery } from '@schema';

export const getCmsPageParser = (data: any): GetCmsPageQuery => {
    return {
        cmsPage: {
            url_key: "home",//data.site.content.page.path TODO: obtain his BigCommerce equivalent
            content: data.site.content.page.htmlBody,
            content_heading: "", //TODO: obtain his BigCommerce equivalent
            title: data.site.content.page.name,
            page_layout: "1column", //TODO: obtain his BigCommerce equivalent
            meta_title: data.site.content.page.seo.pageTitle,
            meta_keywords: data.site.content.page.seo.metaKeywords,
            meta_description: data.site.content.page.seo.metaDescription//"B2bStore description"
        }
    };
};
