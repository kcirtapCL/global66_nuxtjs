<template>
  <div>
    <ValidationProvider v-slot="{ classes, errors }"
                        :name="label"
                        :rules="formatRules"
                        slim>
      <div class="relative"
           :class="classes">
        <v-select v-model="dropdownValue"
                  v-bind="config"
                  :filter="filterSearch"
                  :disabled="disabled">
          <template #no-options="{search, searching}">
            <template v-if="searching">
              {{ $t("form.noResult", {term: search}) }}
            </template>
          </template>
        </v-select>
        <span v-if="showError && errors[0]"
              class="validate">{{ errors[0] }}</span>
      </div>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { normalize } from "~/utils/helpers";

export default {
  name: "GSelect",
  components: { vSelect, ValidationProvider },
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: [String, Number, Object],
      default: null
    },
    config: {
      type: Object,
      required: true,
      default () {
        return {
          placeholder: "Seleccionar",
          options: []
        };
      }
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
      if (this.rules) {
        this.rules.forEach((value, index) => {
          base += index !== (this.rules.length - 1) ? `${value}|` : value;
        });
      }
      return base;
    },
    dropdownValue: {
      get () {
        return this.value;
      },
      set (newDropdownValue) {
        this.$emit("input", newDropdownValue);
        this.$emit("change", newDropdownValue);
      }
    }
  },
  methods: {
    filterSearch (options, search) {
      return options.filter((option) => {
        if (normalize(option, "L").match(search.toLowerCase())) {
          return option;
        }
        return false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-select {
  @apply w-full h-14;

  &::v-deep.vs--disabled {
    .vs__dropdown-toggle {
      @include disabled-input;

      .vs__selected-options {
        input[type="search"] {
          @apply bg-transparent;

          @include placeholder(text-neutral-5, text-sm);
        }
      }
    }
  }

  &.vs--open {
    ::v-deep.vs__dropdown-toggle {
      .vs__selected-options {
        .vs__selected {
          @apply opacity-0;
        }
      }
    }
  }

  ::v-deep.vs__dropdown-toggle {
    @apply h-14 px-5 pb-0 border-2 border-solid border-transparent bg-neutral-12 shadow-2 rounded-md;

    .vs__selected-options {
      @apply p-0;

      .vs__selected {
        @apply m-0 p-0 border-0 font-body font-medium text-neutral-2;

        img {
          @apply w-6 h-6 rounded-full object-cover object-center;
        }
      }

      input[type="search"] {
        @apply inset-0 w-full h-full m-0 p-0 border-0 text-neutral-2 font-body font-medium absolute;

        @include placeholder(text-neutral-5, text-sm);
      }
    }

    .vs__actions {
      @apply p-0;

      .vs__clear {
        svg {
          @apply text-neutral-5 fill-current;
        }
      }

      .vs__open-indicator {
        @apply text-neutral-5 fill-current;
      }
    }
  }

  ::v-deep.vs__dropdown-menu {
    @apply top-16 rounded-md p-0 border-0 shadow-2;

    .vs__dropdown-option {
      @apply py-4 px-5 text-neutral-2 font-body font-medium;

      &.vs__dropdown-option--selected {
        @apply bg-neutral-9;
      }

      &.vs__dropdown-option--highlight {
        @apply text-neutral-12 bg-neutral-5;
      }
    }

    .vs__no-options {
      @apply py-4 px-5 text-neutral-2 font-body font-medium;
    }
  }
}

.valid {
  ::v-deep.v-select {
    .vs__dropdown-toggle {
      @include valid-form;
    }
  }
}

.invalid {
  ::v-deep.v-select {
    .vs__dropdown-toggle {
      @include invalid-form;
    }
  }
}
</style>
