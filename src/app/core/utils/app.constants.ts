export const ACTION_TYPE = {
  SUCCESS: 'Success',
  FAILED: 'Error',
};

export interface TabItem {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
}

export interface FormValues {
  key: string;
  label: string;
  controlName?: string;
  type: string;
  optionName?: string;
  defaultValue?: string;
}
export interface TableColumnHeader {
  name: string;
  class: string;
  sortKey?: string;
  hideSort?: boolean;
}
export interface HeaderFilter {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export const COMPANY_COLUMNS: TableColumnHeader[] = [
  {
    name: 'Company name',
    class: 'large-column',
    sortKey: 'name',
  },
  {
    name: 'Created on',
    class: 'normal-column',
    sortKey: 'created_on',
  },
  {
    name: 'Country',
    class: 'normal-column',
    sortKey: 'country',
  },
  {
    name: 'Supply chains',
    class: 'large-column',
    sortKey: 'supplyChain',
  },
  {
    name: 'Farmers',
    class: 'normal-column',
    sortKey: 'farmer',
  },
  {
    name: 'Transactions',
    class: 'normal-column',
    sortKey: 'transaction',
  },
  {
    name: 'Status',
    class: 'normal-column',
    sortKey: 'status',
  },
  {
    name: '',
    class: 'option-column',
    sortKey: 'none',
    hideSort: true,
  },
];

export const SUPPLY_CHAIN_COLUMNS: TableColumnHeader[] = [
  {
    name: 'Supply chain',
    class: 'normal-column',
  },
  {
    name: 'Products',
    class: 'large-column',
  },
  {
    name: 'No.of companies',
    class: 'normal-column',
  },
  {
    name: 'No.of farmers',
    class: 'normal-column',
  },
  {
    name: '',
    class: 'options-column',
  },
];

export const PROFILE_SUPPLY_CHAIN_COLUMNS: TableColumnHeader[] = [
  {
    name: 'Supply chain',
    class: 'large-column',
  },
  {
    name: 'Company type',
    class: 'normal-column',
  },
  {
    name: 'No.of tiers',
    class: 'normal-column',
  },
  {
    name: 'Companies',
    class: 'normal-column',
  },
  {
    name: 'Farmers',
    class: 'normal-column',
  },
];

export const PRODUCT_COLUMNS: TableColumnHeader[] = [
  {
    name: 'Product name',
    class: 'large-column',
  },
  {
    name: 'Supply chain',
    class: 'normal-column',
  },
  {
    name: 'Description',
    class: 'large-column',
  },
  {
    name: '',
    class: 'options-column',
  },
];

export const CLAIM_COLUMNS: TableColumnHeader[] = [
  {
    name: 'Claim title',
    class: 'large-column',
  },
  {
    name: 'Claim type',
    class: 'normal-column',
  },
  {
    name: 'Supply chains',
    class: 'large-column',
  },
  {
    name: 'Description',
    class: 'large-column',
  },
  {
    name: 'Status',
    class: 'normal-column',
  },
  {
    name: '',
    class: 'options-column',
  },
];

export const USERS_COLUMNS: TableColumnHeader[] = [
  {
    name: 'Name',
    class: 'large-column',
  },
  {
    name: 'Email',
    class: 'large-column',
  },
  {
    name: 'Role',
    class: 'normal-column',
  },
  {
    name: 'Status',
    class: 'normal-column',
  },
];

export const FARMER_COLUMNS: TableColumnHeader[] = [
  {
    name: 'Farmer name',
    class: 'large-column',
    sortKey: 'name',
  },
  {
    name: 'Created on',
    class: 'normal-column',
    sortKey: 'created_on',
  },
  {
    name: 'Supplying to',
    class: 'large-column',
    sortKey: 'supplying',
  },
  {
    name: 'Country',
    class: 'normal-column',
    sortKey: 'country',
  },
  {
    name: 'Supply chains',
    class: 'large-column',
    sortKey: 'supplyChains',
  },
];

export const TRANSACTION_COLUMNS: TableColumnHeader[] = [
  {
    name: 'ID',
    class: 'smaller-column',
    sortKey: 'number',
  },
  {
    name: 'Sender',
    class: 'large-column',
    sortKey: 'name',
  },
  {
    name: 'Receiver',
    class: 'large-column',
    sortKey: 'receiver',
  },
  {
    name: 'Product',
    class: 'normal-column',
    sortKey: 'product',
  },
  {
    name: 'Quantity (kg)',
    class: 'normal-column',
    sortKey: 'quantity',
  },
  {
    name: 'Date',
    class: 'normal-column',
    sortKey: 'date',
  },
  {
    name: 'Blockchain log',
    class: 'large-column',
    sortKey: 'blockChain',
  },
];

export const SEARCHBY_OPTIONS: { id: string; name: string }[] = [
  {
    id: 'all',
    name: 'All',
  },
];
export const MONTH_ABB = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export enum exportType {
  ADMIN_COMPANY = 7,
  ADMIN_FARMER = 8,
  ADMIN_EXTERNAL_TRANSACTION = 9,
  INCOME = 10,
}

export enum exportFileType {
  EXCEL = 1,
  CSV = 2,
}

export interface IconConfig {
  isMatIcon: boolean;
  icon: string;
}
export interface IList {
  title: string;
  description: string;
  leftIcon?: IconConfig;
  rightIcon?: IconConfig;
}
