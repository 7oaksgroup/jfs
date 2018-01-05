<template>
  <a :href="href">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: 'Button',
  props: ['href']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  text-decoration: none;
  color: #fff;
  background-color: #ff69b4;
  padding: 10px 30px;
  border-radius: 12px;
  box-shadow: 2px 2px 6px -3px #000;
  cursor: pointer;
}
</style>
