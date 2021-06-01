<template>
  <div>
    <a v-if="href"
       :href="href"
       :target="target"
       :rel="rel"
       :class="[defaultClasses, sizeButton, styles]">
      <slot />
    </a>
    <button v-else
            :disabled="disabled"
            :class="[defaultClasses, disabledButton, sizeButton, styles]"
            @click="$emit('click', $event)">
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  name: "GButton",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    href: {
      type: String,
      default: null
    },
    rel: {
      type: String,
      default: "noreferrer noopener"
    },
    target: {
      type: String,
      default: "_blank"
    },
    size: {
      type: String,
      default: "medium"
    },
    styles: {
      type: String,
      default: "bg-primary-3 text-neutral-12"
    }
  },
  data () {
    return {
      defaultClasses: "font-semibold text-center transition-all duration-300 ease-in-out"
    };
  },
  computed: {
    disabledButton () {
      return this.disabled ? "disabled" : false;
    },
    sizeButton () {
      const sizes = {
        small: "py-4 px-4",
        medium: "py-4 px-6",
        large: "py-4 px-12"
      };

      return sizes[this.size] ?? false;
    }
  }
};
</script>

<style scoped></style>
