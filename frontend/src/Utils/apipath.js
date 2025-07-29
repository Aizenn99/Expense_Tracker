export const BASE_URL = import.meta.env.REACT_APP_BASE_URL;

//utils/apipaths.js



export const API_PATH = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getUser",
  },
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },
  INCOME: {
    ADD_INCOME : "/api/v1/incomes/add",
    GET_ALL_INCOME : "/api/v1/incomes/get",
    DELETE_INCOME : (incomeId) => `/api/v1/incomes/delete-income/${incomeId}`,
    DOWNLOAD_INCOME : `/api/v1/incomes/downloadexcel`,
  },
  EXPENSE: {
    ADD_EXPENSE : "/api/v1/expenses/add",
    GET_ALL_EXPENSE : "/api/v1/expenses/get",
    DELETE_EXPENSE : (expenseId) => `/api/v1/expenses/delete-expense/${expenseId}`,
    DOWNLOAD_EXPENSE : `/api/v1/expenses/downloadexcel`,
  },
  IMAGE : {
    UPLOAD_IMAGE : "/api/v1/auth/upload-image",
  }
};
