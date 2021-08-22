<template>
  <div class="g-collapse">
    <input :id="`gc${id}`"
           name="collapse"
           type="checkbox"
           class="hidden"
           @input="eventRadio($event)">
    <label :for="`gc${id}`"
           class="block cursor-pointer font-semibold px-10 py-6 relative rounded-lg text-lg z-10"
           :class="[darkClass ? 'text-neutral-12 bg-neutral-2' : 'text-neutral-2 bg-neutral-8']">
      <slot name="title" />
      <font-awesome-icon :icon="['fas', 'angle-up']"
                         :class="[darkClass ? 'text-neutral-12' : 'text-neutral-2']"
                         class="absolute duration-200 fa-lg h-6 icon inset-y-0 my-auto right-4 transition w-7" />
    </label>
    <div class="-top-1.5 article bg-neutral-12 duration-200 ease-in-out overflow-hidden relative rounded-b-lg shadow-1 transition transition-maxHeight z-0"
         :class="[`gc${id}`, darkClass ? 'text-neutral-2 leading-normal' : 'text-neutral-4 leading-normal']">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "GCollapse",
  props: {
    id: {
      type: [Number, String],
      default: null
    },
    isDark: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    darkClass () {
      return this.isDark;
    }
  },
  methods: {
    eventRadio (event) {
      const ACTUAL = document.getElementById(event.target.id);
      const TARGET = document.getElementsByClassName(event.target.id)[0];
      const COLLAPSE = document.getElementsByClassName("article");
      const CHECKBOX = document.getElementsByName("collapse");

      if (TARGET.style.maxHeight) {
        TARGET.style.maxHeight = null;
        TARGET.previousElementSibling.classList.remove("active");
        ACTUAL.checked = false;
      } else {
        for (let i = 0; i < COLLAPSE.length; i++) {
          COLLAPSE[i].style.maxHeight = null;
          CHECKBOX[i].nextElementSibling.classList.remove("active");
          CHECKBOX[i].checked = false;
        }
        TARGET.style.maxHeight = TARGET.scrollHeight + "px";
        TARGET.previousElementSibling.classList.add("active");
        ACTUAL.checked = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.g-collapse {
  label {
    &.active {
      svg {
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        transform: rotate(180deg);
      }
    }
  }

  .article {
    max-height: 0;

    > div {
      @apply py-8 px-10 text-left;
    }
  }
}
</style>
