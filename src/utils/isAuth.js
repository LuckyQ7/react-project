const key = "HKZFTOKEN";
const getToken = () => localStorage.getItem(key);

const saveToken = () => localStorage.setItem(key);

const removeToken = () => localStorage.removeItem(key);

const isAuth = () => !!getToken();

export { getToken, saveToken, removeToken, isAuth };
