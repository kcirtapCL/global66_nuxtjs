<template>
  <div class="g-icon">
    <font-awesome-icon :icon="[styleType, icon]"
                       @click="$emit('click', $event)" />
  </div>
</template>

<script>
export default {
  name: "GIcon",
  props: {
    icon: {
      type: String,
      required: true,
      default: "money-bill-alt"
    },
    styleType: {
      type: String,
      default: "fas"
    }
  }
};
</script>

<style scoped></style>
