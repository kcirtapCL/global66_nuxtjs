export const useWebP = () => {
  const canvas = document.createElement("canvas");
  if (canvas.getContext && canvas.getContext("2d")) {
    if (canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0) {
      return document.getElementsByTagName("html")[0].classList.add("webp");
    }
  }
  return document.getElementsByTagName("html")[0].classList.add("no-webp");
};

export const currencyFormatter = (options = {}) => {
  const language = options.language || "es";
  const country = options.country || "CL";
  const locale = `${language}-${country}`;
  const amountFormat = new Intl.NumberFormat(locale);
  return {
    format (amount, decimal = 0, currency = "") {
      amount = amount.toFixed(decimal);
      if (amount > 9999.999) {
        amount = amountFormat.format(amount);
      } else {
        const notation = this.getNotation();
        const [amountStr, decimalStr] = amount.toString().split(".");
        amount = amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, notation.thousand);
        amount = decimalStr ? `${amount}${notation.decimal}${decimalStr}` : amount;
      }
      return currency ? `${amount} ${currency}` : amount;
    },
    getNotation () {
      const amount = 987654.333;
      const types = amountFormat.formatToParts(amount);
      return {
        thousand: types[1].value,
        decimal: types[3].value
      };
    }
  };
};

export const smoothScroll = (element) => {
  const button = document.getElementsByClassName("smooth");
  for (let i = 0; i < button.length; i++) {
    button[i].addEventListener("click", () => {
      const offset = document.getElementById(element.target.hash.substr(1)).offsetTop;
      window.scrollBy({
        top: offset,
        left: 0,
        behavior: "smooth"
      });
    }, false);
  }
};

export const decodeJSON = (value) => {
  return JSON.parse("{\"" + decodeURI(value).replace(/"/g, "\\\"").replace(/&/g, "\",\"").replace(/=/g, "\":\"") + "\"}");
};

export const encodeJSON = (value) => {
  const array = [];
  for (const i in value) {
    array.push(`${encodeURIComponent(i)}=${encodeURIComponent(value[i])}`);
  }
  return array.join("&");
};
