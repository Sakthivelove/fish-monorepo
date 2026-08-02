export const getToken = () =>
  localStorage.getItem("adminToken");

export const logout = () => {
  localStorage.removeItem("adminToken");
};