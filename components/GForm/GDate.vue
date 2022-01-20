<template>
  <div>
    <ValidationProvider v-slot="{ classes, errors }"
                        :name="label"
                        :rules="formatRules"
                        slim>
      <div class="relative"
           :class="statusValidate(classes)">
        <input class="border-2 border-solid border-transparent box-border duration-300 ease-in-out font-body font-medium h-14 outline-none px-5 rounded-md shadow-2 text-neutral-2 transition w-full"
               type="date"
               :value="value"
               :disabled="disabled"
               :class="{'disabled':disabled}"
               @change="$emit('change', $event.target.value)">
        <span v-if="showError && errors[0]"
              class="validate">{{ errors[0] }}</span>
      </div>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  name: "GDate",
  components: { ValidationProvider },
  model: {
    prop: "value",
    event: "change"
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

  span.validate {
    @include invalid-span;
  }
}
</style>
