<template>
  <div>
    <ValidationProvider v-slot="{ classes, errors }"
                        :name="label"
                        :rules="formatRules"
                        slim>
      <div class="relative"
           :class="statusValidate(classes)">
        <input class="border-2 border-solid border-transparent box-border duration-300 ease-in-out font-body font-medium h-14 outline-none pt-6 px-5 rounded-md shadow-2 text-neutral-2 transition w-full"
               :type="typeInput"
               :value="value"
               :disabled="disabled"
               :class="{'disabled':disabled}"
               @input="$emit('input', $event.target.value)">
        <label class="-translate-y-1/2 absolute duration-200 ease-in-out font-body font-medium left-5 my-auto pointer-events-none text-neutral-5 text-sm top-1/2 transform transition-all">{{ label }}</label>
        <span v-if="showError && errors[0]"
              class="validate">{{ errors[0] }}</span>
      </div>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  name: "GInput",
  components: { ValidationProvider },
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: String,
      default: null
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
    typeInput: {
      type: String,
      required: true,
      validator: value => ["text", "email"].includes(value)
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
  computed: {
    formatRules () {
      let base = "";
      if (this.rules) {
        this.rules.forEach((value, index) => {
          base += index === (this.rules.length - 1) ? value : value.includes("required") && !this.disabled ? `${value}|` : "";
        });
      }
      return base;
    }
  },
  methods: {
    statusValidate (value) {
      return !this.disabled ? value : "";
    }
  }
};
</script>

<style lang="scss" scoped>
input {
  &:focus {
    + label {
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
}
</style>
