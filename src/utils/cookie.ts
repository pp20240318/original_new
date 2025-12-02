// 设置cookie
export const setCookie = function (
  key: string,
  value: string | number | boolean,
  expires: number | Date
) {
  // expires means days from now when it is number
  if (typeof expires === "number") {
    expires = new Date(Date.now() + expires * 24 * 60 * 60 * 1000);
  }
  document.cookie = `${key}=${encodeURIComponent(
    value
  )};path=/;expires=${expires.toUTCString()}`;
};

// 读取cookie
export const getCookie = function (key: string) {
  const reg = RegExp("(^| )" + key + "=([^;]+)(;|$)");
  const arr = document.cookie.match(reg);
  return arr ? decodeURIComponent(arr[2]) : null;
};

// 删除cookie
export const removeCookie = function (key: string) {
  document.cookie = `${key}=${encodeURIComponent(
    getCookie(key) ?? ""
  )};expires=${new Date(Date.now() - 1000).toUTCString()}`;
};

// 清空cookie
export const clearCookie = function () {
  const keys = document.cookie.match(/[^ =;]+(?==)/g);
  keys?.forEach((key) => removeCookie(key));
};
