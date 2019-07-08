export const getUserToken = () => localStorage.getItem('token');
export const isLoggedIn = () => !!getUserToken();
