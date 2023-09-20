import { ClientProps } from 'src';
import { AddNewCustomerAddressToAddressBookMutationVariables } from '@schema';

import DEFAULT_OPERATIONS from './addNewCustomerAddressToAddressBook.gql';
import { useState } from 'react';

interface AddNewCustomerAddressToAddressBookProps extends AddNewCustomerAddressToAddressBookMutationVariables {
    onSuccess?: any;
    hasOnSuccess?: boolean;
}

const AddNewCustomerAddressToAddressBook =
    (clientProps: ClientProps) => (resolverProps: AddNewCustomerAddressToAddressBookProps = { address: {}, hasOnSuccess: false }) => {
        const { mergeOperations, useAwaitQuery, restClient } = clientProps;
        const { hasOnSuccess } = resolverProps;
        const [error, setError] = useState(undefined);
        const [loading, setLoading] = useState(false);

        const { getCustomerIdQuery } = mergeOperations(DEFAULT_OPERATIONS);
        const getCustomerId = useAwaitQuery(getCustomerIdQuery);

        const createCustomerAddress = async ({ variables }) => {
            setLoading(true);
            try {
                let region = '';
                const { data } = await getCustomerId({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    }
                });

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

                    region = regionData.find((state) => state.id == variables.address.region.region_id).state;
                } else {
                    region = variables.address.region.region;
                }

                const rawData = [
                    {
                        customer_id: data.customer.entityId,
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
                    method: 'POST',
                    headers: {
                        backendTechnology: ['bigcommerce']
                    },
                    body: JSON.stringify(rawData)
                });

                if (hasOnSuccess) {
                    const { onSuccess } = resolverProps;
                    onSuccess();
                }

            } catch (err) {
                console.log(err);
                setError(err);
            }
            setLoading(false);
        };

        return { createCustomerAddress, loading, error };
    };

export default AddNewCustomerAddressToAddressBook;
