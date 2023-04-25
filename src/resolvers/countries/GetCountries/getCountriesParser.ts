import { GetCountriesQuery } from '@schema';

export const getCountriesParser = (data: any): GetCountriesQuery => {
    return {
    countries: data.map((co: any) => ({
        id: co.country_iso2,
        full_name_english: co.country,
        two_letter_abbreviation: co.country_iso2
    }))
};
};
