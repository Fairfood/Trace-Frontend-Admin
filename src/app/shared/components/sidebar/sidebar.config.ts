export interface SidebarItem {
  name: string;
  url: string;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    name: 'sideBar.dashboard',
    url: '/dashboard',
  },
  {
    name: 'sideBar.companies',
    url: '/company',
  },
  {
    name: 'sideBar.farmers',
    url: '/farmers',
  },
  {
    name: 'sideBar.supplyChains',
    url: '/supply-chain',
  },
  {
    name: 'sideBar.products',
    url: '/products',
  },
  {
    name: 'sideBar.claims',
    url: '/claims',
  },
  {
    name: 'sideBar.transactions',
    url: '/transactions',
  },
  {
    name: 'sideBar.team',
    url: '/users',
  },
];
