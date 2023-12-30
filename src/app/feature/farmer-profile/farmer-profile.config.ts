/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormValues,
  TabItem,
  TableColumnHeader,
} from 'src/app/core/utils/app.constants';

export const PROFILE_TABS: TabItem[] = [
  {
    id: 'basic',
    name: 'Basic',
  },
  {
    id: 'farm',
    name: 'Farm',
  },
  {
    id: 'income',
    name: 'Income',
  },
  {
    id: 'logs',
    name: 'Activity',
  },
];

export const BASIC_DETAILS: FormValues[] = [
  {
    key: 'description_full',
    label: 'Description',
    type: 'textarea',
  },
  {
    key: 'name',
    label: 'Name',
    type: 'text',
  },
  {
    key: 'address',
    label: 'Address',
    type: 'text',
  },
  {
    key: 'identification_no',
    label: 'Identification number',
    type: 'text',
  },
  {
    key: 'gender',
    label: 'Gender',
    type: 'text',
  },
  {
    key: 'dob',
    label: 'Date of birth',
    type: 'text',
  },
  {
    key: 'birth_city',
    label: 'Birth city',
    type: 'text',
  },
  {
    key: 'income_from_main_product',
    label: 'Income from main product (Euro)',
    type: 'text',
  },
  {
    key: 'income_from_other_sources',
    label: 'Income from other source (Euro)',
    type: 'text',
  },
];

export const PRODUCTION_DETAILS: FormValues[] = [
  {
    key: 'street',
    label: 'Street name',
    type: 'text',
  },
  {
    key: 'city',
    label: 'City/village',
    type: 'text',
  },
  {
    key: 'province',
    label: 'Province',
    type: 'text',
  },
  {
    key: 'country',
    label: 'Country',
    type: 'text',
  },
  {
    key: 'zipcode',
    label: 'Postal code',
    type: 'text',
  },
  // {
  //   key: 'latitude',
  //   label: 'Latitude',
  //   type: 'text',
  // },
  // {
  //   key: 'longitude',
  //   label: 'Longitude',
  //   type: 'text',
  // },
];

export interface IReference {
  count: number;
  results: any[];
  loading: boolean;
}

export const PAYMENTS_COLUMNS: TableColumnHeader[] = [
  {
    name: 'References',
    class: 'normal-column',
  },
  {
    name: 'Source',
    class: 'normal-column',
  },
  {
    name: 'Payment type',
    class: 'normal-column',
  },
  {
    name: 'Verification type',
    class: 'normal-column',
  },
  {
    name: 'Date',
    class: 'normal-column',
  },
  {
    name: 'Amount',
    class: 'normal-column',
  },
  {
    name: 'Receipt',
    class: 'large-column',
  },
];
