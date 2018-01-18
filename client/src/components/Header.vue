<template>
  <div class="header" :class="{ reverse: reverse }">
    <div class="container">
      <div class="logo">
        JustForStylists
      </div>
      <div class="menu">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    reverse: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  width: 100%;
  height: 65px;
  text-align: left;
  border-bottom: 1px solid black;
}
.header.reverse {
  color: white;
  background-color: rgba(0, 0, 0, 0.8);
  border-bottom: none;
}
.logo {
  font-style: italic;
  padding: 22px 45px;
  font-weight: 700;
  font-size: 18px;
}
.menu {
  position: absolute;
  right: 20px;
  top: 20px;
}
</style>
