import { TabItem } from 'src/app/core/utils/app.constants';

export const CLAIM_TABS_COMPANY: TabItem[] = [
  {
    id: 'details',
    name: 'Basic details',
    description: 'Claim details',
    active: true,
  },
  {
    id: 'evidence',
    name: 'Evidences',
    description: 'Add evidence type for this claim',
    active: false,
  },
];

export const CLAIM_TABS: TabItem[] = [
  ...CLAIM_TABS_COMPANY,
  {
    id: 'props',
    name: 'Claim properties and verifier',
    description: 'Provide all the required claims',
    active: false,
  },
];

export const EVIDENCE_TYPE = [
  {
    id: 1,
    name: 'Text field',
  },
  {
    id: 2,
    name: 'Dropdown',
  },
];
export const STATUS_FILTER = [
  {
    id: true,
    name: 'Active',
  },
  {
    id: false,
    name: 'Inactive',
  },
];

export const TYPE_FILTER = [
  {
    id: 1,
    name: 'Product',
  },
  {
    id: 2,
    name: 'Company',
  },
];
