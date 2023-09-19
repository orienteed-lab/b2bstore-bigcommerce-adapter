import { ClientProps } from 'src';
import { UpdateCustomerAddressInAddressBookMutationVariables } from '@schema';

import { useState } from 'react';

interface UpdateCustomerAddressInAddressBookProps extends UpdateCustomerAddressInAddressBookMutationVariables {
    onSuccess?: any;
    hasOnSuccess: boolean;
}

const UpdateCustomerAddressInAddressBook =
    (clientProps: ClientProps) => (resolverProps: UpdateCustomerAddressInAddressBookProps = { hasOnSuccess: false, addressId: 0, updated_address: {} }) => {
        const { restClient } = clientProps;
        const { hasOnSuccess } = resolverProps;
        const [error, setError] = useState(undefined);
        const [loading, setLoading] = useState(false);

        const updateCustomerAddress = async ({ variables }) => {
            setLoading(true);
            try {
                let region = '';

                if (variables.updated_address) {
                    if (variables.updated_address.region.region_id) {
                        const countryData = await restClient(`/api/v2/countries?country_iso2=${variables.updated_address.country_code}`, {
                            method: 'GET',
                            headers: {
                                backendTechnology: ['bigcommerce']
                            }
                        });

                        const regionData = await restClient(`/api/v2/countries/${countryData[0].id}/states`, {
                            method: 'GET',
                            headers: {
                                backendTechnology: ['bigcommerce']
                            }
                        });

                        if (regionData.find((state) => state.id == variables.updated_address.region.region_id)) {
                            region = regionData.find((state) => state.id == variables.updated_address.region.region_id).state;
                        } else {
                            region = null;
                        }
                    } else {
                        region = variables.updated_address.region.region;
                    }

                    const rawData = [
                        {
                            id: variables.addressId,
                            country_code: variables.updated_address.country_code,
                            first_name: variables.updated_address.firstname,
                            address1: variables.updated_address.street[0],
                            city: variables.updated_address.city,
                            state_or_province: region,
                            postal_code: variables.updated_address.postcode,
                            phone: variables.updated_address.telephone,
                            last_name: variables.updated_address.lastname
                        }
                    ];

                    await restClient(`/api/v3/customers/addresses`, {
                        method: 'PUT',
                        headers: {
                            backendTechnology: ['bigcommerce']
                        },
                        body: JSON.stringify(rawData)
                    });

                    if (hasOnSuccess) {
                        const { onSuccess } = resolverProps;
                        onSuccess();
                    }

                } else {
                    if (variables.address.region.region_id) {
                        const countryData = await restClient(`/api/v2/countries?country_iso2=${variables.address.country_code}`, {
                            method: 'GET',
                            headers: {
                                backendTechnology: ['bigcommerce']
                            }
                        });

                        const regionData = await restClient(`/api/v2/countries/${countryData[0].id}/states`, {
                            method: 'GET',
                            headers: {
                                backendTechnology: ['bigcommerce']
                            }
                        });

                        if (regionData.find((state) => state.id == variables.address.region.region_id)) {
                            region = regionData.find((state) => state.id == variables.address.region.region_id).state;
                        } else {
                            region = null;
                        }
                    } else {
                        region = variables.address.region.region;
                    }

                    const rawData = [
                        {
                            id: variables.addressId,
                            country_code: variables.address.country_code,
                            first_name: variables.address.firstname,
                            address1: variables.address.street[0],
                            city: variables.address.city,
                            state_or_province: region,
                            postal_code: variables.address.postcode,
                            phone: variables.address.telephone,
                            last_name: variables.address.lastname
                        }
                    ];

                    await restClient(`/api/v3/customers/addresses`, {
                        method: 'PUT',
                        headers: {
                            backendTechnology: ['bigcommerce']
                        },
                        body: JSON.stringify(rawData)
                    });

                    if (hasOnSuccess) {
                        const { onSuccess } = resolverProps;
                        onSuccess();
                    }

                }
            } catch (err) {
                console.log(err);
                setError(err);
            }
            setLoading(false);
        };

        return { updateCustomerAddress, loading, error };
    };

export default UpdateCustomerAddressInAddressBook;
