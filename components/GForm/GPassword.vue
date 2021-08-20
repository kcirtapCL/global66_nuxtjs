<template>
  <div class="g-password">
    <ValidationProvider v-slot="{ classes, errors }"
                        :name="label"
                        :rules="formatRules"
                        slim>
      <div class="relative space-y-1"
           :class="statusValidate(classes)">
        <div class="relative">
          <input class="border-2 border-solid border-transparent box-border duration-300 ease-in-out font-body font-medium h-14 outline-none pl-5 pr-12 pt-6 rounded-md shadow-2 text-neutral-2 transition w-full"
                 :type="typeInput"
                 :value="value"
                 :disabled="disabled"
                 :class="{'disabled':disabled}"
                 @input="$emit('input', $event.target.value)">
          <label class="-translate-y-1/2 absolute duration-200 ease-in-out font-body font-medium left-5 my-auto pointer-events-none text-neutral-5 text-sm top-1/2 transform transition-all">{{ $t(`form.label.${label}`) }}</label>
          <span class="absolute h-5 icon inset-y-0 my-auto right-4 w-7">
            <svg v-show="!showPassword"
                 class="cursor-pointer h-5 w-7"
                 viewBox="0 0 26 21"
                 xmlns="http://www.w3.org/2000/svg"
                 @click="changeTypePassword">
              <path fill="#D7DCF0"
                    d="M13,16.4c-3.1,0-5.6-2.4-5.8-5.5L2.9,7.6C2.4,8.3,1.9,9.1,1.4,9.9c-0.1,0.2-0.1,0.4-0.1,0.6s0,0.4,0.1,0.6
              C3.6,15.4,8,18.4,13,18.4c1.1,0,2.1-0.2,3.2-0.4l-2.1-1.6C13.7,16.4,13.4,16.4,13,16.4z M25.7,18.8l-4.5-3.5
              c1.4-1.2,2.5-2.6,3.3-4.2c0.1-0.2,0.1-0.4,0.1-0.6s0-0.4-0.1-0.6C22.4,5.6,18,2.6,13,2.6c-2.1,0-4.1,0.5-6,1.5l-5.2-4
              C1.8,0.1,1.7,0,1.6,0C1.5,0,1.5,0,1.4,0C1.3,0,1.2,0,1.1,0.1C1.1,0.1,1,0.2,0.9,0.3l-0.8,1C0,1.4,0,1.6,0,1.8c0,0.2,0.1,0.3,0.2,0.4
              l23.9,18.7c0.1,0.1,0.1,0.1,0.2,0.1c0.1,0,0.2,0,0.3,0s0.2,0,0.2-0.1c0.1,0,0.1-0.1,0.2-0.2l0.8-1c0.1-0.1,0.2-0.3,0.1-0.5
              C26,19.1,25.9,18.9,25.7,18.8z M18.3,13l-1.6-1.2c0.1-0.4,0.2-0.8,0.2-1.2c0-0.6-0.1-1.2-0.4-1.8c-0.3-0.5-0.7-1-1.1-1.4
              c-0.5-0.4-1-0.6-1.6-0.7S12.5,6.5,12,6.7c0.2,0.3,0.4,0.7,0.4,1.2c0,0.1,0,0.3-0.1,0.4L9.3,6c1-0.9,2.3-1.4,3.7-1.4
              c0.8,0,1.5,0.2,2.2,0.4c0.7,0.3,1.4,0.7,1.9,1.3c0.5,0.5,1,1.2,1.3,1.9c0.3,0.7,0.4,1.5,0.4,2.3C18.8,11.4,18.6,12.2,18.3,13
              L18.3,13z" />
            </svg>
            <svg v-show="showPassword"
                 class="cursor-pointer h-5 w-7"
                 viewBox="0 0 26 21"
                 xmlns="http://www.w3.org/2000/svg"
                 @click="changeTypePassword">
              <path fill="#9AA5D3"
                    d="M24.4,9.9C22.2,5.5,17.9,2.5,13,2.5c-4.9,0-9.2,3-11.4,7.4c-0.1,0.2-0.1,0.4-0.1,0.6c0,0.2,0,0.4,0.1,0.6
              c2.2,4.4,6.5,7.4,11.4,7.4c4.9,0,9.2-3,11.4-7.4c0.1-0.2,0.1-0.4,0.1-0.6C24.5,10.3,24.5,10.1,24.4,9.9z M13,16.5
              c-1.1,0-2.2-0.4-3.2-1c-0.9-0.7-1.7-1.6-2.1-2.7c-0.4-1.1-0.5-2.3-0.3-3.5c0.2-1.2,0.8-2.2,1.6-3.1c0.8-0.8,1.8-1.4,2.9-1.6
              C13,4.4,14.1,4.5,15.2,5c1.1,0.5,1.9,1.2,2.6,2.2c0.6,1,1,2.1,1,3.3c0,0.8-0.1,1.6-0.4,2.3c-0.3,0.7-0.7,1.4-1.2,1.9
              c-0.5,0.6-1.2,1-1.9,1.3C14.5,16.3,13.8,16.5,13,16.5z M13,6.5c-0.3,0-0.7,0.1-1,0.2C12.3,7,12.4,7.5,12.4,8c0,0.5-0.2,0.9-0.6,1.3
              c-0.3,0.3-0.8,0.5-1.2,0.6c-0.5,0-0.9-0.1-1.3-0.4c-0.2,0.8-0.2,1.7,0.1,2.4c0.3,0.8,0.8,1.5,1.5,1.9c0.7,0.5,1.5,0.7,2.3,0.7
              c0.8,0,1.6-0.3,2.2-0.8c0.6-0.5,1.1-1.2,1.3-2c0.2-0.8,0.2-1.7,0-2.4c-0.3-0.8-0.7-1.5-1.4-2C14.6,6.8,13.8,6.5,13,6.5z" />
            </svg>
          </span>
        </div>
        <div class="flex flex-row items-center"
             :class="`pass-control_${getPasswordStrength}`">
          <div class="flex-1 h-2 rounded-full w-full">
            <span class="block duration-500 h-2 rounded-full transition-all" />
          </div>
          <span class="font-medium text-right text-xs w-3/12">{{ $t(`form.password.${getPasswordStrength}`) }}</span>
        </div>
        <span class="block font-medium text-left text-xs validate">{{ errors[0] }}</span>
      </div>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  name: "GPassword",
  components: { ValidationProvider },
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      required: true,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showPassword: false,
      typeInput: "password"
    };
  },
  computed: {
    formatRules () {
      let base = "";
      if (this.rules) {
        this.rules.forEach((value, index) => {
          base += index === (this.rules.length - 1) ? value : value.includes("required") && !this.disabled ? `${value}|` : "";
        });
      }
      return base;
    },
    getPasswordStrength () {
      let progress = 0;
      if (this.value.length >= 8) {
        progress += 1;
      }
      if (/\d/.test(this.value)) {
        progress += 1;
      }
      if (/(.*[A-Z].*)/.test(this.value)) {
        progress += 1;
      }
      if (/(.*[a-z].*)/.test(this.value)) {
        progress += 1;
      }

      if (progress === 4) {
        return "strong";
      } else if (progress === 3) {
        return "normal";
      }
      return "weak";
    }
  },
  methods: {
    statusValidate (value) {
      return !this.disabled ? value : "";
    },
    changeTypePassword () {
      this.showPassword = !this.showPassword;
      this.typeInput = this.showPassword ? "text" : "password";
    }
  }
};
</script>

<style scoped></style>
