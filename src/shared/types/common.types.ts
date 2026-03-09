export type Role = 'SUPER_ADMIN' | 'BUSINESS_OWNER' | 'ADMIN' | 'CUSTOMER';

export type Permission = 
  | 'DASHBOARD_ACCESS'
  | 'SUBSCRIPTION_PLAN_MANAGEMENT'
  | 'OFFER_MANAGEMENT'
  | 'BRANCH_MANAGEMENT'
  | 'GIFT_CARD_MANAGEMENT'
  | 'PURCHASES_MANAGEMENT'
  | 'PRICE_LIST_MANAGEMENT'
  | 'APPROVAL'
  | 'SALES';

export interface User {
  id: number;
  name: string;
  username?: string;
  phone: string;
  email?: string;
  dob?: string;
  role: Role;
  permissions?: Permission[];
}

export interface Notification {
  message: string;
  type: 'success' | 'error';
}
