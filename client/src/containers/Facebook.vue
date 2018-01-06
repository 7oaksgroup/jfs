<template>
  <div class="facebook">
    Loading...
  </div>
</template>


<script>
export default {
  name: 'Facebook',
  async beforeCreate() {
    const search = window.location.search.substr(1)
    await this.$store.dispatch('facebookConnect', { search })
    this.$router.push('/register')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
