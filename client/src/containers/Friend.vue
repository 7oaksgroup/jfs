<template>
  <div class="friend">
    <Header></Header>
    <h2>Find a Friend</h2>
    <hr/>
    <p>We are creating an amazing community. <br/> Let's get you connected! <br/> Find the person that referred you or someone else.</p>

    <p>Find a facebook friend.</p>
    <p>Search for one of your facebook friends that is already part of the facebook community.</p>
    <a>Show Facebook Friends</a>

    <p>Search by name</p>
    <p>Enter the first or last name of a friend to search for someone you may know.</p>
    <input type="text" v-model="searchName" placeholder="Friend's Name" />
    <a @click="searchFriend">Enter Name</a>
    <ul>
      <li v-for="friend in friends" :key="friend.id">
        <img width="50" height="50" :src="friend.avatar_url " />
        <p>{{friend.first_name}} {{friend.last_name}}</p>
      </li>
    </ul>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import Header from '@/components/Header'

export default {
  name: 'Friend',
  components: {
    Header
  },
  data() {
    return {
      searchName: ''
    }
  },
  methods: {
    async searchFriend() {
      await this.$store.dispatch('search', this.searchName)
    }
  },
  computed: {
    ...mapState({
      friends: state => state.friends
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
