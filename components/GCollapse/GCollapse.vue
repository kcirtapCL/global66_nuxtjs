<template>
  <div>
    <input :id="`gc${id}`"
           name="collapse"
           type="checkbox"
           @input="eventRadio($event)">
    <label :for="`gc${id}`"
           :class="darkClass">
      <slot name="title" />
    </label>
    <div class="article"
         :class="[`gc${id}`, darkClass]">
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
      return this.isDark ? "dark-theme" : "white-theme";
    }
  },
  methods: {
    eventRadio (event) {
      const actual = document.getElementById(event.target.id);
      const target = document.getElementsByClassName(event.target.id)[0];
      const collapse = document.getElementsByClassName("article");
      const checkbox = document.getElementsByName("collapse");

      if (target.style.maxHeight) {
        target.style.maxHeight = null;
        target.previousElementSibling.classList.remove("active");
        actual.checked = false;
      } else {
        for (let i = 0; i < collapse.length; i++) {
          collapse[i].style.maxHeight = null;
          checkbox[i].nextElementSibling.classList.remove("active");
          checkbox[i].checked = false;
        }
        target.style.maxHeight = target.scrollHeight + "px";
        target.previousElementSibling.classList.add("active");
        actual.checked = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.collapse {
  input {
    @apply hidden;
  }

  label {
    @apply py-6 px-10 block text-lg font-semibold rounded-lg relative z-10 cursor-pointer;

    &::after {
      content: '';
      right: 1rem;
      @apply top-0 bottom-0 w-6 h-6 m-auto block bg-no-repeat bg-center bg-contain absolute transition-all duration-300 ease-in-out;
    }

    &:not(.active) {
      &::after {
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        transform: rotate(180deg);
      }
    }

    &.white-theme {
      @apply text-neutral-2 bg-neutral-8;

      &::after {
        background-image: url('~/assets/svg/arrow-blue.svg');
      }
    }

    &.dark-theme {
      @apply text-neutral-12 bg-neutral-2;

      &::after {
        background-image: url('~/assets/svg/arrow-white.svg');
      }
    }
  }

  .article {
    top: -5px;
    max-height: 0;
    @apply bg-neutral-12 rounded-b-lg relative z-0 shadow-1 overflow-hidden transition transition-maxHeight duration-200 ease-in-out;

    > div {
      @apply py-8 px-10;
    }

    &.white-theme {
      @apply text-neutral-4 leading-normal;
    }

    &.dark-theme {
      @apply text-neutral-2 leading-normal;
    }
  }
}
</style>
