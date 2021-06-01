<template>
  <div>
    <picture>
      <source :srcset="require(`~/assets/${image}.webp`)"
              type="image/webp">
      <source :srcset="require(`~/assets/${image}.${extension}`)"
              :type="`image/${extension}`">
      <img :src="require(`~/assets/${image}.${extension}`)"
           :alt="altText">
    </picture>
  </div>
</template>

<script>

export default {
  name: "GImage",
  props: {
    altText: {
      type: String,
      required: true,
      default: null
    },
    extension: {
      type: String,
      required: true,
      default: null
    },
    image: {
      type: String,
      required: true,
      default: null
    }
  }
};
</script>

<style scoped></style>
