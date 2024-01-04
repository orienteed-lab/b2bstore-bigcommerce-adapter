import { ClientProps } from 'src';

import { getConfigDetailsForSavedCartsParser } from './getConfigDetailsForSavedCartsParser';

const GetConfigDetailsForSavedCarts = (clientProps: ClientProps) => () => {
    return { data: getConfigDetailsForSavedCartsParser() };
};

export default GetConfigDetailsForSavedCarts;
