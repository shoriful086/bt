export type IUpdateUserData = {
  name?: string;
  email?: string;
  phoneNumber?: string;
  balance?: number;
  depositBalance?: number;
};

export type IFilterParams = {
  searchTerm?: string;
  email?: string;
  phoneNumber?: string;
  referrelCode?: string;
};
