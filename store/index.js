import { getCookie, setCookie } from "~/utils/cookie";

export const state = () => ({
  ipLocation: {}
});

export const mutations = {
  SET_IP_LOCATION (state, value) {
    state.ipLocation = value;
  }
};

export const actions = {
  async getIpLocation ({ state, commit }) {
    if (!getCookie("IpCountryCode")) {
      await this.$axios.$get(`${this.$config.IP_DOMAIN}/?fields=status,countryCode,message&key=${this.$config.IP_DOMAIN_API}`)
        .then((response) => {
          // eslint-disable-next-line no-console
          console.info("IpCountry available");
          commit("SET_IP_LOCATION", response.countryCode.toLowerCase());
          setCookie("IpCountryCode", response.countryCode.toLowerCase(), 30, true);
        }).catch(() => {
          // eslint-disable-next-line no-console
          console.info("IpCountry ready");
          commit("SET_IP_LOCATION", { countryCode: "cl" });
          setCookie("IpCountryCode", "cl", 15);
        });
    } else if (!state.ipLocation.length) {
      commit("SET_IP_LOCATION", getCookie("IpCountryCode"));
    }
  }
};

export const getters = {
  ipLocation: (state) => {
    return state.ipLocation;
  }
};
