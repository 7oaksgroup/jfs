<template>
  <div class="header">
    <div class="container">
      <div class="logo">
        JustStylists
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header'
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
.logo {
  font-style: italic;
  padding: 22px 45px;
  font-weight: 700;
  font-size: 18px;
}
</style>
