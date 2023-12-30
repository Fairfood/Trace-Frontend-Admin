export interface SidebarItem {
  name: string;
  url: string;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
  },
  {
    name: 'Companies',
    url: '/company',
  },
  {
    name: 'Farmers',
    url: '/farmers',
  },
  {
    name: 'Supply chains',
    url: '/supply-chain',
  },
  {
    name: 'Products',
    url: '/products',
  },
  {
    name: 'Claims',
    url: '/claims',
  },
  {
    name: 'Transactions',
    url: '/transactions',
  },
  {
    name: 'Team',
    url: '/users',
  },
];
