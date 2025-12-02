// 设置sessionStorage
export const setSession = function <T = any>(key: string, value: T) {
  return sessionStorage.setItem(key, JSON.stringify(value));
};

// 读取sessionStorage
export const getSession = function <T = any>(key: string) {
  const value = sessionStorage.getItem(key);
  if (value === null) return value;
  if (value === "undefined") return value as T;
  return JSON.parse(value) as T;
};

// 删除sessionStorage
export const removeSession = function (key: string) {
  return sessionStorage.removeItem(key);
};

// 清空sessionStorage
export const clearSession = function () {
  return sessionStorage.clear();
};
