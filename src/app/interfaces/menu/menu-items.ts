export interface MenuInterface {
  label: string;
  icon: string;
  route: string[];
}

export const MenuItems: MenuInterface[] = [
  {
    label: 'Ventas',
    icon: 'shopping_cart',
    route: ['/ventas'],
  },
  {
    label: 'Galletas',
    icon: 'cookie',
    route: ['/cookies'],
  },
  {
    label: 'Producción',
    icon: 'factory',
    route: ['/produccion'],
  },
];
