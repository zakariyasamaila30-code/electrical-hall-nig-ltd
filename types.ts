export interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  sku?: string;
  unit: string;
}

export interface CartItem extends Item {
  cartQuantity: number;
}

export interface Transaction {
  id: string;
  date: Date;
  customerName?: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  type: "sale" | "purchase";
  isTaxable?: boolean;
  taxAmount?: number;
}

export interface CompanySettings {
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  rcNumber: string;
  motto: string;
}

export interface RolePermission {
  id: string;
  name: string;
  description?: string;
  permissions: {
    dashboard: boolean;
    categories: boolean;
    products: boolean;
    reports: boolean;
    sales: boolean;
    procurement: boolean;
    accounting: boolean;
    settings: boolean;
    users: boolean;
    subscriptions: boolean;
    costcentres: boolean;
  };
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  password: string;
  roleId: string;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  createdAt: Date;
}

export interface SupplierTransaction {
  id: string;
  supplierId: string;
  type: "debit" | "credit";
  amount: number;
  description: string;
  referenceNumber?: string;
  date: Date;
  createdAt: Date;
}
