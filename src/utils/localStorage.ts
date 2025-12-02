// 设置localStorage
export const setLocal = function <T = any>(key: string, value: T) {
  return localStorage.setItem(key, JSON.stringify(value));
};

// 读取localStorage
export const getLocal = function <T = any>(key: string) {
  const value = localStorage.getItem(key);
  if (value === null) return value;
  if (value === "undefined") return value as T;
  return JSON.parse(value) as T;
};

// 删除localStorage
export const removeLocal = function (key: string) {
  return localStorage.removeItem(key);
};

// 清空localStorage
export const clearLocal = function () {
  return localStorage.clear();
};
