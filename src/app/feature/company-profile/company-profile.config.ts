import { FormValues, TabItem } from 'src/app/core/utils/app.constants';

export const PROFILE_TABS: TabItem[] = [
  {
    id: 'basic',
    name: 'Basic details',
  },
  {
    id: 'team',
    name: 'Team members',
  },
  {
    id: 'supplyChain',
    name: 'Active supply chain',
  },
  {
    id: 'logs',
    name: 'Activity',
  },
];

export const BASIC_DETAILS: FormValues[] = [
  {
    key: 'description_basic',
    label: 'Description',
    controlName: 'description',
    type: 'textarea',
  },
  {
    key: 'street',
    label: 'Street name',
    controlName: 'street',
    type: 'text',
  },
  {
    key: 'country',
    label: 'Country',
    controlName: 'country',
    type: 'dropdown',
    optionName: 'countryList',
    defaultValue: 'country',
  },
  {
    key: 'province',
    label: 'Province',
    controlName: 'province',
    type: 'dropdown',
    optionName: 'stateList',
    defaultValue: 'province',
  },
  {
    key: 'city',
    label: 'City/Village',
    controlName: 'city',
    type: 'text',
  },
  {
    key: 'zipcode',
    label: 'Postal code',
    controlName: 'zipCode',
    type: 'text',
  },
  {
    key: 'latitude',
    label: 'Latitude',
    controlName: 'latitude',
    type: 'text',
  },
  {
    key: 'longitude',
    label: 'Longitude',
    controlName: 'longitude',
    type: 'text',
  },
];
