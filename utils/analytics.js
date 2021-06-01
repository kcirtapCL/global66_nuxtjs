import { setCookie } from "~/utils/cookie";
import { decodeJSON } from "~/utils/helpers";

export const dataPush = (value) => {
  // eslint-disable-next-line no-undef
  dataLayer.push({
    event: value
  });
};

export const initialUTM = () => {
  const query = location.search.substring(1);
  if (query.length) {
    const decode = decodeJSON(query);
    if (decode.utm_source !== undefined && decode.utm_medium !== undefined && decode.utm_campaign !== undefined) {
      setCookie("utm_mkt", query, false);
    }
  }
};
