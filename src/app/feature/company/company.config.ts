import { TabItem } from 'src/app/core/utils/app.constants';

export const INVITE: TabItem[] = [
  {
    id: 'connection',
    name: 'Connection details',
    description: 'Connection summary',
    active: true,
  },
  {
    id: 'address',
    name: 'Address details',
    description: 'Address summary',
    active: false,
  },
];

export const COMPANY_ADDRESS = [
  {
    key: 'street',
    label: 'Street name *',
    controlName: 'street',
    type: 'text',
  },
  {
    key: 'city',
    label: 'City/Village *',
    controlName: 'city',
    type: 'text',
  },
  {
    key: 'country',
    label: 'Country *',
    controlName: 'country',
    type: 'dropdown',
    defaultValue: 'country',
  },
  {
    key: 'province',
    label: 'Province *',
    controlName: 'province',
    type: 'dropdown',
    defaultValue: 'province',
  },
  {
    key: 'zipcode',
    label: 'Postal code',
    controlName: 'zipcode',
    type: 'text',
  },
];
