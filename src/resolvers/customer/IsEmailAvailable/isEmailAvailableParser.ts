import { IsEmailAvailableQuery } from '@schema';

export const isEmailAvailableParser = (data: any): IsEmailAvailableQuery => {
    return {
        isEmailAvailable: {
            is_email_available: data.length === 0
        }
    };
};
