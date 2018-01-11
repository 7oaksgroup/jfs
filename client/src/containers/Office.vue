<template>
  <div class="facebook">
    <Header></Header>
    <h1>Welcome, {{currentUser.firstName}}</h1>
    <br/>
    <div class="box">
      <h3>Share Link</h3>
      <p>User this link to share this community with others!</p>
      <p>{{shareUrl}}</p>
      <p>{{safeShareUrl}}</p>
    </div>
    <div class="box">
      <h3>Facebook Group</h3>
      <p>Please join our facebook group!</p>
      <p>link to facebook</p>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import Header from '@/components/Header'

export default {
  name: 'Office',
  components: {
    Header
  },
  async beforeCreate() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push('/')
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.currentUser,
      shareUrl: state =>
        `${window.location.origin}/invite?friend=${state.currentUser.email}`,
      safeShareUrl: state =>
        `${window.location.origin}/invite?friend=${state.currentUser.id}`
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
