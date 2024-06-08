//cringe!! this is a security risk, but for the sake of simplicity

const _ACCESS_TOKEN_KEY = "access_token";

export const getStoredAuthToken = () => localStorage.getItem(_ACCESS_TOKEN_KEY);

export const setStoredAuthToken = (token: string) =>
  localStorage.setItem(_ACCESS_TOKEN_KEY, token);

export const removeStoredAuthToken = () =>
  localStorage.removeItem(_ACCESS_TOKEN_KEY);
