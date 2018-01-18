<template>
  <div class="facebook">
    <Header>
      <a @click="logout">Logout</a>
    </Header>
    <h1>Welcome, {{firstName}}!</h1>
    <img width="75" height="75" :src="currentUser.avatar_url"/>
    <br/>
    <div class="box">
      <h3>Share Link</h3>
      <p>Use this link to share this community with others!</p>
      <input type="text" v-model="safeShareUrl" readonly/>
    </div>
    <div class="box">
      <h3>Facebook Group</h3>
      <p>Please join our facebook group!</p>
      <Button href="https://www.facebook.com/groups/142418766393701/">Join Facebook Group</Button>
    </div>
    <div class="box">
      <h3>Community Size: {{count}}</h3>
    </div>
    <div class="box">
      <h3>Your circle of influence</h3>
      <div v-for="stylist in influence" :key="stylist.id">
        <p>{{stylist.first_name}}{{stylist.last_name}}</p>
        <img width="75" height="75" :src="stylist.avatar_url"/>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import Header from '@/components/Header'
import Button from '@/components/Button'

export default {
  name: 'Office',
  components: {
    Button,
    Header
  },
  mounted() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push('/')
      return
    }
    this.$store.dispatch('getInfluence')
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
  },
  computed: {
    firstName() {
      return this.$store.getters.firstName
    },
    ...mapState({
      currentUser: state => state.currentUser,
      safeShareUrl: state =>
        `${window.location.origin}/invite?inviteCode=${state.currentUser.id}`,
      inviteCode: state => state.inviteCode,
      count: state => state.count,
      influence: state => state.influence
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h3,
p {
  font-family: Palatino, 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua',
    Georgia, serif;
  font-style: italic;
}
img {
  border-radius: 100%;
}

input {
  border: 1px solid #ff69b4;
  text-align: center;
  padding: 10px 5px;
  width: 100%;
  max-width: 600px;
  font-size: 16px;
}

a {
  cursor: pointer;
}
</style>
