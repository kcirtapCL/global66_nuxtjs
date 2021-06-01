import dayjs from "dayjs";

export const setCookie = (name, value, days, localhost = false) => {
  if (days) {
    const expire = dayjs().add(days, "day");
    if (localhost) {
      return (document.cookie = `${name}=${value}; expires=${expire.toDate()}; path=/; domain=localhost`);
    }
    return (document.cookie = `${name}=${value}; expires=${expire.toDate()}; path=/; domain=.global66.com`);
  } else {
    if (localhost) {
      return (document.cookie = `${name}=${value}; path=/; domain=localhost`);
    }
    return (document.cookie = `${name}=${value}; path=/; domain=.global66.com`);
  }
};

export const getCookie = (name) => {
  const decode = document.cookie ? document.cookie.split("; ") : [];
  for (let i = 0; i < decode.length; i++) {
    const nameCookie = decode[i].split("=");
    const valueCookie = nameCookie.slice(1).join("=");

    if (nameCookie[0] === name) {
      return decodeURIComponent(valueCookie);
    }
  }
  return false;
};

export const delCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};
