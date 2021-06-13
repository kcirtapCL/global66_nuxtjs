<template>
  <div>
    <ValidationProvider v-slot="{ classes, errors }"
                        :name="label"
                        :rules="formatRules"
                        slim>
      <div class="relative"
           :class="classes">
        <input :type="typeInput"
               :value="value"
               :disabled="disabled"
               :class="{'disabled':disabled}"
               class="font-body font-medium h-14 outline-none pt-6 px-5 rounded-md shadow-2 text-neutral-2 w-full"
               @input="$emit('input', $event.target.value)">
        <label class="-translate-y-1/2 absolute duration-200 ease-in-out font-body font-medium left-5 my-auto pointer-events-none text-neutral-5 text-sm top-1/2 transform transition-all">{{ label }}</label>
        <span v-if="showError && errors[0]"
              class="block font-body font-medium pt-1 text-left text-semantic-1 text-xs">{{ errors[0] }}</span>
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
      type: [String, Boolean],
      default: false
    },
    label: {
      type: [String, Boolean],
      required: true,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    typeInput: {
      type: String,
      required: true,
      default: "text",
      validator: (value) => {
        return ["text", "email"].includes(value);
      }
    },
    rules: {
      type: [Array, Boolean],
      default: false
    },
    showError: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formatRules () {
      let base = "";
      this.rules.forEach((value, index) => {
        base += index !== (this.rules.length - 1) ? `${value}|` : value;
      });
      return base;
    }
  }
};
</script>

<style scoped></style>
