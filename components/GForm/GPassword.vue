<template>
  <div class="g-password">
    <ValidationProvider v-slot="{ classes, errors }"
                        :name="label"
                        :rules="formatRules"
                        slim>
      <div class="space-y-1"
           :class="statusValidate(classes)">
        <div class="relative">
          <input class="border-2 border-solid border-transparent box-border duration-300 ease-in-out font-body font-medium h-14 outline-none pl-5 pr-12 pt-6 rounded-md shadow-2 text-neutral-2 transition w-full"
                 :type="typeInput"
                 :value="value"
                 :disabled="disabled"
                 :class="{'disabled':disabled}"
                 @input="$emit('input', $event.target.value)">
          <label class="-translate-y-1/2 absolute duration-200 ease-in-out font-body font-medium left-5 my-auto pointer-events-none text-neutral-5 text-sm top-1/2 transform transition-all">{{ $t(`form.label.${label}`) }}</label>
          <font-awesome-layers class="absolute fa-lg h-6 icon inset-y-0 my-auto right-4 w-7">
            <g-icon v-show="!showPassword"
                    icon="eye-slash"
                    class="cursor-pointer text-neutral-7"
                    @click="changeTypePassword" />
            <g-icon v-show="showPassword"
                    icon="eye"
                    class="cursor-pointer text-neutral-5"
                    @click="changeTypePassword" />
          </font-awesome-layers>
        </div>
        <div class="flex flex-row items-center"
             :class="`pass-control_${getPasswordStrength}`">
          <div class="flex-1 h-2 rounded-full w-full">
            <span class="block duration-500 h-2 rounded-full transition-all" />
          </div>
          <span class="font-medium text-right text-xs w-3/12">{{ $t(`form.password.${getPasswordStrength}`) }}</span>
        </div>
        <span v-if="showError && errors[0]"
              class="validate">{{ errors[0] }}</span>
      </div>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import GIcon from "~/components/GIcon/GIcon";

export default {
  name: "GPassword",
  components: { GIcon, ValidationProvider },
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
    },
    showError: {
      type: Boolean,
      default: false
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

<style lang="scss" scoped>
.g-password {
  input {
    &:focus {
      ~ label {
        @include label-input;
      }
    }

    &.disabled {
      @include disabled-input;
    }
  }

  .valid, .invalid {
    input {
      ~ label {
        @include label-input;
      }
    }
  }

  .valid {
    input {
      @include valid-form;
    }
  }

  .invalid {
    input {
      @include invalid-form;
    }

    span.validate {
      @include invalid-span;
    }
  }

  .pass-control {
    &_weak {
      div {
        @apply bg-semantic-1 bg-opacity-10;

        span {
          @apply w-1/3 bg-semantic-1;
        }
      }

      span {
        @apply text-semantic-1
      }
    }

    &_normal {
      div {
        @apply bg-semantic-4 bg-opacity-10;

        span {
          @apply w-2/3 bg-semantic-4;
        }
      }

      span {
        @apply text-semantic-4;
      }
    }

    &_strong {
      div {
        @apply bg-accent-2 bg-opacity-10;

        span {
          @apply w-full bg-accent-2;
        }
      }

      span {
        @apply text-accent-2;
      }
    }
  }
}
</style>
