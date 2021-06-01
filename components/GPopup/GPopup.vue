<template>
  <div>
    <transition name="fade_popup">
      <div v-if="visible"
           class="popup"
           :class="styleDesign">
        <div class="container-box">
          <div class="close-button">
            <span @click="close()">
              <svg viewBox="0 0 22 22"
                   xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0608 11.0002L15.2659 7.79506L15.9269 7.1341C16.0244 7.03659 16.0244 6.87815 15.9269 6.78065L15.2197 6.07344C15.1222 5.97594 14.9637 5.97594 14.8662 6.07344L11.0002 9.9395L7.1341 6.07313C7.03659 5.97562 6.87815 5.97562 6.78065 6.07313L6.07313 6.78034C5.97562 6.87784 5.97562 7.03628 6.07313 7.13379L9.9395 11.0002L6.07313 14.8662C5.97562 14.9637 5.97562 15.1222 6.07313 15.2197L6.78034 15.9269C6.87784 16.0244 7.03628 16.0244 7.13379 15.9269L11.0002 12.0608L14.2053 15.2659L14.8662 15.9269C14.9637 16.0244 15.1222 16.0244 15.2197 15.9269L15.9269 15.2197C16.0244 15.1222 16.0244 14.9637 15.9269 14.8662L12.0608 11.0002Z" />
              </svg>
            </span>
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
.popup {
  @apply top-0 right-0 bottom-0 left-0 w-screen h-screen absolute;

  &::before {
    content: "";
    background-color: rgba(0, 0, 0, .8);
    @apply top-0 right-0 bottom-0 left-0 w-full h-full fixed z-40;
  }

  .container-box {
    top: 50%;
    min-height: 80%;
    @apply m-auto py-16 px-8 max-w-3xl rounded-2xl relative z-50 transform -translate-y-1/2;

    .close-button {
      top: 4%;
      right: 4%;
      @apply w-6 h-6 absolute rounded-full transition-colors duration-300;

      span {
        @apply block cursor-pointer;

        svg {
          @apply w-6 h-6 fill-current transition-colors duration-300;
        }
      }
    }
  }

  &.style {
    &-default {
      .container-box {
        @apply bg-primary-3;

        .close-button {
          @apply bg-neutral-9;

          &:hover {
            @apply bg-neutral-5;

            span {
              svg {
                @apply text-neutral-9;
              }
            }
          }

          span {
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
