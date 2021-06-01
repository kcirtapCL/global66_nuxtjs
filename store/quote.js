import { currencyFormatter } from "~/utils/helpers";

export const state = () => ({
  customers: [],
  customerSend: [],
  customerReceive: [],
  customerSendDefault: {},
  customerReceiveDefault: {},
  customerSendFormat: {},
  customerReceiveFormat: {}
});

export const mutations = {
  SET_CUSTOMERS (state, customers) {
    state.customers = customers;
  },
  SET_CUSTOMERS_SEND (state, customer) {
    state.customerSend = customer;
  },
  SET_CUSTOMERS_RECEIVE (state, customer) {
    state.customerReceive = customer;
  },
  SET_CUSTOMER_SEND_DEFAULT (state, value) {
    state.customerSendDefault = value[0];
    if (value[1]) {
      state.customerSendDefault.defaultAmount = value[1];
    }
  },
  SET_CUSTOMER_RECEIVE_DEFAULT (state, value) {
    state.customerReceiveDefault = value[0];
    if (value[1]) {
      state.customerReceiveDefault.defaultAmount = value[1];
    }
  },
  SET_CUSTOMER_SEND_FORMAT (state, value) {
    state.customerSendFormat = value;
  },
  SET_CUSTOMER_RECEIVE_FORMAT (state, value) {
    state.customerReceiveFormat = value;
  },
  UPDATE_CUSTOMER_SEND_AMOUNT (state, amount) {
    state.customerSendDefault.defaultAmount = amount;
  },
  UPDATE_CUSTOMER_RECEIVE_AMOUNT (state, amount) {
    state.customerReceiveDefault.defaultAmount = amount;
  }
};

export const actions = {
  async getCustomers ({ state, commit, dispatch }, arrayProps = []) {
    if (!state.customers.length) {
      await this.$axios.$get(`${this.$config.BASE}/quote/external/routes`)
        .then((response) => {
          const responseMapped = response.map((value) => {
            return {
              id: value.id,
              canSend: value.canSend,
              canReceive: value.canReceive,
              countryAlpha2Code: value.country.alpha2Code,
              countryFlag: value.country.alpha2Code.toLowerCase(),
              countryNameES: value.country.nameES,
              currencyName: value.currency.name,
              currencyCode: value.currency.code,
              defaultAmount: value.defaultAmount,
              defaultLanguage: value.defaultLanguage.toLowerCase(),
              timeTransfer: value.timeOfferedTransferH
            };
          });
          commit("SET_CUSTOMERS", responseMapped);
          dispatch("getCustomerCanSend");
          dispatch("getCustomerCanReceive");
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });

      if (arrayProps.length) {
        dispatch("setCustomerSendDefault", arrayProps[0]);
      }
    }
  },
  getCustomerCanSend ({ state, commit }, values = {}) {
    const countryName = values.countryName || null;
    const filterReceive = state.customers
      .filter(country => country.canSend && country.countryNameES !== countryName)
      .sort((a, b) => a.countryNameES.localeCompare(b.countryNameES));
    commit("SET_CUSTOMERS_SEND", filterReceive);
  },
  getCustomerCanReceive ({ state, commit }, values = {}) {
    const countryName = values.countryName || null;
    const filterReceive = state.customers
      .filter(country => country.canReceive && country.countryNameES !== countryName)
      .sort((a, b) => a.countryNameES.localeCompare(b.countryNameES));
    commit("SET_CUSTOMERS_RECEIVE", filterReceive);
  },
  setCustomerSendDefault ({ state, commit, dispatch }, values = {}) {
    const customerId = values.id || null;
    const customerAmount = values.amount || 0;
    const setDefault = state.customerSend.filter(country => country.id === customerId)[0];
    const setFormat = currencyFormatter({
      country: setDefault.countryAlpha2Code,
      language: setDefault.defaultLanguage
    }).getNotation();
    dispatch("getCustomerCanReceive", { countryName: setDefault.countryNameES });
    commit("SET_CUSTOMER_SEND_DEFAULT", [setDefault, customerAmount]);
    commit("SET_CUSTOMER_SEND_FORMAT", setFormat);
  },
  setCustomerReceiveDefault ({ state, commit, dispatch }, values = {}) {
    const customerId = values.id || null;
    const customerAmount = values.amount || 0;
    const setDefault = state.customerReceive.filter(country => country.id === customerId)[0];
    const setFormat = currencyFormatter({
      country: setDefault.countryAlpha2Code,
      language: setDefault.defaultLanguage
    }).getNotation();
    dispatch("getCustomerCanSend", { countryName: setDefault.countryNameES });
    commit("SET_CUSTOMER_RECEIVE_DEFAULT", [setDefault, customerAmount]);
    commit("SET_CUSTOMER_RECEIVE_FORMAT", setFormat);
  },
  updateCustomerSendAmount ({ commit }, amount) {
    commit("UPDATE_CUSTOMER_SEND_AMOUNT", amount);
  },
  updateCustomerReceiveAmount ({ commit }, amount) {
    commit("UPDATE_CUSTOMER_RECEIVE_AMOUNT", amount);
  },
  allowedEcuador ({ state, commit }, values = {}) {
    const destinations = values.destinations || null;
    const filter = state.customerReceive
      .filter(country => country.canReceive && destinations.includes(country.id))
      .sort((a, b) => a.countryNameES.localeCompare(b.countryNameES));
    commit("SET_CUSTOMERS_RECEIVE", filter);
    commit("SET_CUSTOMER_RECEIVE_DEFAULT", [filter[0], 0]);
  },
  allowedPeruBrasil ({ state, commit }, values = {}) {
    const way = values.way || null;
    const countries = values.country || null;
    if (way === "send") {
      const filter = state.customerReceive
        .filter(country => country.canReceive && !countries.includes(country.id))
        .sort((a, b) => a.countryNameES.localeCompare(b.countryNameES));
      commit("SET_CUSTOMERS_RECEIVE", filter);
    } else {
      const filter = state.customerSend
        .filter(country => country.canSend && !countries.includes(country.id))
        .sort((a, b) => a.countryNameES.localeCompare(b.countryNameES));
      commit("SET_CUSTOMERS_SEND", filter);
    }
  }
}
;

export const getters = {
  allCustomers: (state) => {
    return state.customers;
  },
  customerSend: (state) => {
    return state.customerSend;
  },
  customerReceive: (state) => {
    return state.customerReceive;
  },
  customerSendDefault: (state) => {
    return state.customerSendDefault;
  },
  customerReceiveDefault: (state) => {
    return state.customerReceiveDefault;
  },
  customerSendFormat: (state) => {
    return state.customerSendFormat;
  },
  customerReceiveFormat: (state) => {
    return state.customerReceiveFormat;
  }
};
