<template>
  <div class="g-quote">
    <div class="flex flex-row">
      <div class="bg-neutral-12 flex flex-col items-start pl-3 py-3 rounded-l w-full">
        <label class="font-medium text-neutral-4 text-sm"
               for="inputSend">Tú envías</label>
        <v-cleave id="inputSend"
                  autocomplete="off"
                  :options="cleaveSendRules"
                  :value="customerSendDefault.defaultAmount"
                  class="font-semibold outline-none text-2xl text-neutral-3 w-full"
                  @input="keyCheck($event, 'send')"
                  @focus.native="isFocused = false" />
      </div>
      <div class="bg-neutral-2 flex items-center justify-center rounded-r">
        <v-select :filter="filterSearch"
                  :get-option-label="(option) => `${option.currencyCode} - ${option.countryNameES}`"
                  :options="customerSend"
                  :value="customerSendDefault"
                  label="id"
                  @input="changeSelect($event, 'send')">
          <template slot="option"
                    slot-scope="option">
            <img v-if="option.countryNameES"
                 :alt="option.countryNameES"
                 :src="require(`~/assets/flags/gc_country_flag_${option.countryFlag}.svg`)">
            <p>
              <span class="font-bold">{{ option.currencyCode }}</span> · {{ option.countryNameES }}
            </p>
          </template>
          <template slot="selected-option"
                    slot-scope="option">
            <img v-if="option.countryNameES"
                 :alt="option.countryNameES"
                 :src="require(`~/assets/flags/gc_country_flag_${option.countryFlag}.svg`)"
                 class="border border-neutral-12 border-solid">
            <p class="font-semibold ml-1 text-lg text-neutral-12">
              {{ option.currencyCode }}
            </p>
          </template>
          <template slot="no-options">
            <p>Origen no encontrado</p>
          </template>
        </v-select>
      </div>
    </div>
    <div>
      <div v-if="!rangeLimit.status"
           class="block-details py-6">
        <ul class="space-y-4">
          <li class="font-semibold lg:text-base relative space-x-1 text-neutral-5 text-sm">
            <span class="text-neutral-2">{{ customerTax.fee }}</span> · Costo
          </li>
          <li class="font-semibold lg:text-base relative space-x-1 text-neutral-5 text-sm">
            <span class="text-neutral-2">{{ customerTax.convert }}</span> · Cantidad a convertir
          </li>
          <li class="font-semibold lg:text-base relative space-x-1 text-neutral-5 text-sm"
              :class="customerTax.type">
            <span class="text-neutral-2">{{ customerTax.rate }}</span> · Tipo de cambio
          </li>
        </ul>
      </div>
      <div v-if="rangeLimit.status"
           class="block-details error py-6">
        <ul>
          <li class="font-semibold lg:text-base relative space-x-1 text-semantic-1 text-sm">
            <span>{{ rangeLimit.message }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex flex-row">
      <div class="bg-neutral-12 flex flex-col items-start pl-3 py-3 rounded-l w-full">
        <label class="font-medium text-neutral-4 text-sm"
               for="inputReceive">Destinatario recibe</label>
        <v-cleave id="inputReceive"
                  autocomplete="off"
                  :options="cleaveReceiveRules"
                  :value="customerReceiveDefault.defaultAmount"
                  class="font-semibold outline-none text-2xl text-neutral-3 w-full"
                  @input="keyCheck($event, 'receive')"
                  @focus.native="isFocused = true" />
      </div>
      <div class="bg-neutral-2 flex items-center justify-center rounded-r">
        <v-select :filter="filterSearch"
                  :get-option-label="(option) => `${option.currencyCode} - ${option.countryNameES}`"
                  :options="customerReceive"
                  :value="customerReceiveDefault"
                  label="id"
                  @input="changeSelect($event, 'receive')">
          <template slot="option"
                    slot-scope="option">
            <img v-if="option.countryNameES"
                 :alt="option.countryNameES"
                 :src="require(`~/assets/flags/gc_country_flag_${option.countryFlag}.svg`)">
            <p>
              <span class="font-bold">{{ option.currencyCode }}</span> · {{ option.countryNameES }}
            </p>
          </template>
          <template slot="selected-option"
                    slot-scope="option">
            <img v-if="option.countryNameES"
                 :alt="option.countryNameES"
                 :src="require(`~/assets/flags/gc_country_flag_${option.countryFlag}.svg`)"
                 class="border border-neutral-12 border-solid">
            <p class="font-semibold ml-1 text-lg text-neutral-12">
              {{ option.currencyCode }}
            </p>
          </template>
          <template slot="no-options">
            <p>Destino no encontrado</p>
          </template>
        </v-select>
      </div>
    </div>
    <div>
      <div class="block-details py-3 sla">
        <ul class="space-y-4">
          <li class="font-semibold lg:text-base relative space-x-1 text-neutral-5 text-sm">
            Tu dinero llegará el <span class="font-bold lg:text-base text-neutral-2 text-sm">{{ customerTax.sla }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="my-4">
      <slot name="buttonSubmit"
            :customClick="submitQuote" />
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import vCleave from "vue-cleave-component";
import dayjs from "dayjs";
import { currencyFormatter, encodeJSON } from "~/utils/helpers";
import "dayjs/locale/es";

export default {
  name: "GQuote",
  components: {
    vSelect,
    vCleave
  },
  props: {
    defaultOrigin: {
      type: Number,
      default: 134
    },
    defaultDestiny: {
      type: Number,
      default: 59
    },
    defaultAmount: {
      type: Number,
      default: 500000
    },
    reference: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      customer: {
        ecuadorAllowed: [86, 117, 134, 137, 210, 227, 266],
        brasilNotAllowed: [270],
        peruNotAllowed: [117]
      },
      changeAmount: {
        count: 0,
        timeout: null
      },
      customerTax: {
        rate: null,
        fee: null,
        convert: null,
        sla: null,
        type: "divide"
      },
      rangeLimit: {
        status: false,
        message: null
      },
      isFocused: false,
      disabledSubmit: false
    };
  },
  computed: {
    customerSend () {
      return this.$store.getters["quote/customerSend"];
    },
    customerReceive () {
      return this.$store.getters["quote/customerReceive"];
    },
    customerSendDefault () {
      return this.$store.getters["quote/customerSendDefault"];
    },
    customerReceiveDefault () {
      return this.$store.getters["quote/customerReceiveDefault"];
    },
    cleaveSendRules () {
      return {
        delimiter: this.$store.getters["quote/customerSendFormat"].thousand || ".",
        numeral: true,
        numeralDecimalMark: this.$store.getters["quote/customerSendFormat"].decimal || ",",
        numeralDecimalScale: 0,
        numeralPositiveOnly: true
      };
    },
    cleaveReceiveRules () {
      return {
        delimiter: this.$store.getters["quote/customerReceiveFormat"].thousand || ".",
        numeral: true,
        numeralDecimalMark: this.$store.getters["quote/customerReceiveFormat"].decimal || ",",
        numeralDecimalScale: 0,
        numeralPositiveOnly: true
      };
    }
  },
  mounted () {
    this.$store.dispatch("quote/getCustomers")
      .then(() => {
        this.init();
      });
  },
  methods: {
    filterSearch (options, search) {
      return options.filter((option) => {
        if (
          option.countryNameES.normalize("NFD")
            .replace(/[\u0300-\u036F]/g, "")
            .toLowerCase()
            .match(search.toLowerCase()) ||
          option.countryAlpha2Code.toLowerCase()
            .match(search.toLowerCase()) ||
          option.currencyCode.toLowerCase()
            .match(search.toLowerCase())
        ) {
          return option;
        }
        return false;
      });
    },
    keyCheck (value, way, timeout = 600) {
      if (value.length) {
        if (way === "send") {
          this.$store.dispatch("quote/updateCustomerSendAmount", value);
        } else {
          this.$store.dispatch("quote/updateCustomerReceiveAmount", value);
        }

        if (this.changeAmount.timeout) {
          clearTimeout(this.changeAmount.timeout);
          this.changeAmount.count++;
        }
        this.changeAmount.timeout = setTimeout(() => {
          this.changeAmount.count === 1 ? this.calculateAmount("send", true) : this.calculateAmount(way, false);
        }, timeout);
      } else {
        // eslint-disable-next-line no-console
        console.error("missing amount");
      }
    },
    changeSelect (value, way) {
      if (value) {
        if (way === "send") {
          const actualAmount = this.$store.getters["quote/customerSendDefault"];
          this.$store.dispatch("quote/setCustomerSendDefault", {
            id: value.id,
            amount: actualAmount.defaultAmount
          });
        } else {
          this.$store.dispatch("quote/setCustomerReceiveDefault", {
            id: value.id
          });
        }
        this.isFocused = false;
        this.updateCustomer(way, value.id);
        this.calculateAmount("send");
      } else {
        // eslint-disable-next-line no-console
        console.info("missing customer id");
      }
    },
    calculateAmount (way, checkCurrency = true) {
      const origin = this.$store.getters["quote/customerSendDefault"];
      const destiny = this.$store.getters["quote/customerReceiveDefault"];

      if (checkCurrency && !this.sameCurrency(origin.currencyCode, destiny.currencyCode)) {
        if (way === "send" && !this.isFocused) {
          this.$axios.get(`${this.$config.BASE}/quote/external?originRoute=${origin.id}&destinationRoute=${destiny.id}&amount=${origin.defaultAmount}&way=origin`)
            .then((response) => {
              const responseData = response.data.quoteData;
              this.$store.dispatch("quote/updateCustomerReceiveAmount", Math.round(responseData.destinationAmount));
              this.customerTax.fee = this.formatAmount().format(responseData.totalFees, 2, origin.currencyCode);
              this.customerTax.convert = this.formatAmount().format((origin.defaultAmount - responseData.totalFees), 2, origin.currencyCode);
              this.customerTax.rate = this.formatAmount().format(responseData.greaterToLesserValueRate, 2);
              this.formatRate(responseData.originRate, responseData.destinationRate);
              this.calculateSLA(origin.id, destiny.id, destiny.timeTransfer);
              this.amountLimit(responseData);
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error);
            });
        }

        if (way === "receive" && this.isFocused) {
          this.$axios.get(`${this.$config.BASE}/quote/external?originRoute=${origin.id}&destinationRoute=${destiny.id}&amount=${destiny.defaultAmount}&way=destiny`)
            .then((response) => {
              const responseData = response.data.quoteData;
              this.$store.dispatch("quote/updateCustomerSendAmount", Math.round(responseData.originAmount));
              this.customerTax.fee = this.formatAmount().format(responseData.totalFees, 2, origin.currencyCode);
              this.customerTax.convert = this.formatAmount().format((origin.defaultAmount - responseData.totalFees), 2, origin.currencyCode);
              this.customerTax.rate = this.formatAmount().format(responseData.greaterToLesserValueRate, 2);
              this.formatRate(responseData.originRate, responseData.destinationRate);
              this.calculateSLA(origin.id, destiny.id, destiny.timeTransfer);
              this.amountLimit(responseData);
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error);
            });
        }
      }
    },
    updateCustomer (way, customerId) {
      if (customerId === 48) {
        this.$store.dispatch("quote/allowedEcuador", { destinations: this.customer.ecuadorAllowed });
      } else if (customerId === 117) {
        this.$store.dispatch("quote/allowedPeruBrasil", { way, country: this.customer.brasilNotAllowed });
      } else if (customerId === 270) {
        this.$store.dispatch("quote/allowedPeruBrasil", { way, country: this.customer.peruNotAllowed });
      }
    },
    sameCurrency (origin, destiny) {
      this.rangeLimit.status = false;
      this.disabledSubmit = false;

      if (origin === destiny) {
        this.rangeLimit.message = `No puedes cotizar con la misma moneda ${origin} - ${destiny}`;
        this.rangeLimit.status = true;
        this.disabledSubmit = true;
        return true;
      }
      return false;
    },
    formatAmount () {
      return currencyFormatter({
        country: this.$store.getters["quote/customerSendDefault"].countryAlpha2Code,
        language: this.$store.getters["quote/customerSendDefault"].defaultLanguage
      });
    },
    formatRate (originRate, destinyRate) {
      this.customerTax.type = originRate > destinyRate ? "divide" : "multiply";
    },
    calculateSLA (origin, destiny, hours) {
      this.$axios.get(`${this.$config.BASE}/transaction/external/eta?origin=${origin}&destiny=${destiny}&hours=${hours}`)
        .then((response) => {
          const responseData = response.data.estimatedSLA;
          this.customerTax.sla = dayjs(responseData)
            .locale("es")
            .format("DD [de] MMMM")
            .toLowerCase();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    },
    amountLimit (value) {
      let isAmountLesserThanMinimum = null;
      let isAmountGreaterThanMaximum = null;
      const minOriginAmount = Math.ceil(value.minOriginAmount);
      const maxOriginAmount = Math.floor(value.maxOriginAmount);
      const minDestinyAmount = Math.ceil(value.minDestinyAmount);
      const maxDestinyAmount = Math.floor(value.maxDestinyAmount);

      isAmountLesserThanMinimum = value.originAmount < minOriginAmount;
      isAmountGreaterThanMaximum = value.originAmount > maxOriginAmount;
      if (isAmountLesserThanMinimum || isAmountGreaterThanMaximum) {
        const formatValue = this.formatAmount().format(isAmountLesserThanMinimum ? minOriginAmount : maxOriginAmount, 2, value.originCurrency);

        if (isAmountLesserThanMinimum) {
          this.rangeLimit.message = `Monto mínimo de origen · ${formatValue}`;
        } else {
          this.rangeLimit.message = `Monto máximo de origen · ${formatValue}`;
        }
        this.rangeLimit.status = true;
        this.disabledSubmit = true;
        return false;
      }

      isAmountLesserThanMinimum = value.destinationAmount < minDestinyAmount;
      isAmountGreaterThanMaximum = value.destinationAmount > maxDestinyAmount;
      if (isAmountLesserThanMinimum || isAmountGreaterThanMaximum) {
        const formatValue = this.formatAmount().format(isAmountLesserThanMinimum ? minDestinyAmount : maxDestinyAmount, 2, value.destinationCurrency);

        if (isAmountLesserThanMinimum) {
          this.rangeLimit.message = `Monto mínimo de destino · ${formatValue}`;
        } else {
          this.rangeLimit.message = `Monto máximo de destino · ${formatValue}`;
        }
        this.rangeLimit.status = true;
        this.disabledSubmit = true;
        return false;
      }

      this.rangeLimit.status = false;
      return true;
    },
    submitQuote () {
      this.disabledSubmit = true;
      const toSend = {
        moneda_inicio: this.$store.getters["quote/customerSendDefault"].id,
        moneda_destino: this.$store.getters["quote/customerReceiveDefault"].id,
        monto_inicio: this.$store.getters["quote/customerSendDefault"].defaultAmount,
        ref: this.reference[0] || "main_site",
        ref2: this.reference[1] || "cotizador"
      };

      window.location.href = `${this.$config.TRANSFER}/signUp?${encodeJSON(toSend)}`;
    },
    init () {
      this.$store.dispatch("quote/setCustomerSendDefault", { id: this.defaultOrigin, amount: this.defaultAmount });
      this.$store.dispatch("quote/setCustomerReceiveDefault", { id: this.defaultDestiny });
    }
  }
};
</script>

<style lang="scss" scoped>
.g-quote {
  .v-select {
    min-width: 124px;
    @apply w-full h-full;

    &::v-deep.vs--open {
      .vs__dropdown-toggle {
        .vs__selected-options {
          .vs__selected {
            @apply opacity-0;
          }
        }
      }
    }

    &::v-deep .vs__dropdown-toggle {
      @apply h-full pb-0 px-4 rounded-l-none border-none;

      .vs__selected-options {
        @apply mr-2 p-0;

        .vs__selected {
          min-width: 70px;
          @apply m-0 p-0;

          img {
            width: 26px;
            height: 26px;
            @apply rounded-full object-cover object-center;
          }
        }

        input[type="search"] {
          @apply top-0 left-0 w-full h-full m-0 p-0 text-neutral-12 font-bold absolute uppercase;
        }
      }

      .vs__actions {
        @apply p-0 text-neutral-12 pointer-events-none;

        button {
          @apply hidden;
        }

        svg {
          @apply fill-current;
        }
      }
    }

    &::v-deep .vs__dropdown-menu {
      min-width: 300px;
      @apply m-0 p-0 block text-left bg-neutral-12 rounded-sm border border-solid border-neutral-6 shadow-md list-none overflow-y-auto;

      li {
        @apply py-2 px-5;

        &.vs__dropdown-option--selected {
          @apply bg-neutral-9;
        }

        &.vs__dropdown-option--highlight {
          @apply bg-neutral-5;
        }

        img {
          width: 26px;
          height: 26px;
          @apply mr-3 inline-block rounded-full object-cover object-center;
        }

        p {
          @apply inline-block text-sm;
        }
      }
    }
  }

  .block-details {
    @apply relative;

    &:not(.sla) {
      &::before {
        content: "";
        @apply top-0 bottom-0 h-full my-auto ml-6 border border-solid border-neutral-2 absolute z-0;
      }

      ul {
        li {
          @apply pl-12;

          &::before {
            content: "";
            left: 13px;
            @apply top-0 bottom-0 w-6 h-6 my-auto bg-neutral-2 rounded-full absolute z-10;
          }

          &:nth-child(1) {
            span {
              &::before {
                background-image: url("~/assets/svg/quote/minus.svg");
              }
            }
          }

          &:nth-child(2) {
            span {
              &::before {
                background-image: url("~/assets/svg/quote/equals.svg");
              }
            }
          }

          &:nth-child(3) {
            &.divide {
              span {
                &::before {
                  background-image: url("~/assets/svg/quote/divide.svg");
                }
              }
            }
            &.multiply {
              span {
                &::before {
                  background-image: url("~/assets/svg/quote/times.svg");
                }
              }
            }
          }

          span {
            &::before {
              content: "";
              width: 10px;
              left: 20px;
              @apply top-0 bottom-0 h-auto m-auto block bg-no-repeat bg-center bg-contain absolute z-10;
            }
          }
        }
      }
    }

    &.sla {
      &::before {
        content: "";
        @apply top-0 bottom-0 h-6 mb-auto ml-6 border border-solid border-neutral-2 absolute z-0;
      }

      ul {
        li {
          @apply pl-12;

          &::before {
            content: "";
            left: 19px;
            @apply top-0 bottom-0 w-3 h-3 my-auto bg-neutral-2 rounded-full absolute z-10;
          }
        }
      }
    }

    &.error {
      &::before {
        @apply border-semantic-1;
      }

      ul {
        li {
          &::before {
            @apply bg-semantic-1;
          }

          &:nth-child(1) {
            span {
              &::before {
                height: 16px;
                background-image: url("~/assets/svg/quote/exclamation.svg");
              }
            }
          }
        }
      }
    }
  }
}
</style>
