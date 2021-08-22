<template>
  <div class="g-popup">
    <transition name="fade_popup">
      <div v-if="visible"
           class="absolute bottom-0 h-screen left-0 right-0 top-0 w-screen"
           :class="styleDesign">
        <div class="-translate-y-1/2 container-box m-auto max-w-3xl min-h-popup px-8 py-16 relative rounded-2xl top-1/2 transform z-50">
          <div class="absolute close-button duration-300 h-6 right-4 rounded-full top-4 transition-colors w-6">
            <font-awesome-icon :icon="['far', 'times-circle']"
                               class="duration-300 fa-2x fill-current h-6 transition-colors w-6"
                               @click="close()" />
          </div>
          <div class="content-popup">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { setCookie, getCookie } from "~/utils/cookie";

export default {
  name: "GPopup",
  props: {
    available: {
      type: Array,
      default () {
        return ["cl"];
      }
    },
    cookie: {
      type: Array,
      default () {
        return ["status_popup", 1];
      }
    },
    design: {
      type: Number,
      default: null
    },
    expire: {
      type: Number,
      default: null
    },
    start: {
      type: Number,
      default: dayjs().millisecond()
    }
  },
  data () {
    return {
      visible: false
    };
  },
  computed: {
    styleDesign () {
      const designs = {};

      return designs[this.design] ?? "style-default";
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      const dateActual = dayjs();
      const dateStart = dayjs(this.start);
      const dateExpire = dayjs(this.expire);

      this.visible = !!(dateActual.isAfter(dateStart) && dateActual.isBefore(dateExpire) && this.available.includes(this.$store.getters.ipLocation) && !getCookie(this.cookie[0]));
    },
    close () {
      this.visible = false;
      setCookie(this.cookie[0], true, this.cookie[1]);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-popup {
  > div {
    &::before {
      content: "";
      background-color: rgba(0, 0, 0, .8);
      @apply top-0 right-0 bottom-0 left-0 w-full h-full fixed z-40;
    }

    &.style {
      &-default {
        .container-box {
          @apply bg-neutral-2;

          .close-button {
            &:hover {
              svg {
                @apply text-neutral-9;
              }
            }

            svg {
              @apply text-neutral-5;
            }
          }
        }
      }
    }
  }
}
</style>
