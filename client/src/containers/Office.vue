<template>
  <div class="facebook">
    Office
  </div>
</template>


<script>
export default {
  name: 'Facebook',
  async beforeCreate() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push('/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
