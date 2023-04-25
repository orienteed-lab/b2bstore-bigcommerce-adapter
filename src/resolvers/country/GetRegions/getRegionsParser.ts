import { GetRegionsQuery } from '@schema';

export const getRegionsParser = ( data: any): GetRegionsQuery => {

    return {
        country: {
            id: data[0].country_id,
            available_regions: data.map((reg: any) => ({
                id: reg.id,
                code: reg.state_abbreviation,
                name: reg.state
            }))
        }
    };
};



