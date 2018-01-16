<template>
  <div class="friend">
    <Header></Header>
    <h2>Find a Friend</h2>
    <hr/>
    <p>We are creating an amazing community. 
      <br/> Let's get you connected! 
      <br/> Find the person that referred you or someone else.
    </p>

    <h4>Find a facebook friend.</h4>
    <p>Search for one of your facebook friends that is already part of the facebook community.</p>
    <a class="button" @click="showFriends">Show Facebook Friends</a>

    <h4>Search by name</h4>
    <p>Enter the first or last name of a friend to search for someone you may know.</p>
    <input type="text" v-model="searchName" placeholder="Friend's Name" />
    <a class="button" @click="searchFriend">Enter Name</a>
    <div class="container">
      <div class="flex">
        <div v-for="friend in friends" :key="friend.id" @click="setFriend(friend.id)">
          <img width="75" height="75" :src="friend.avatar_url" />
          <p>{{friend.first_name}} {{friend.last_name}}</p>
        </div>
      </div>
    </div>
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
    async showFriends() {
      await this.$store.dispatch('showFacebookFriends')
    },
    async searchFriend() {
      await this.$store.dispatch('search', this.searchName)
    },
    async setFriend(id) {
      this.$store.dispatch('saveFriend', id)
      this.$router.push('/register')
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
h2,
h4,
p {
  font-family: Palatino, 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua',
    Georgia, serif;
  font-style: italic;
}
hr {
  width: 100px;
  border-color: #ff69b4;
  border-style: solid;
}
input {
  display: block;
  height: 25px;
  margin: 15px auto;
  padding-left: 10px;
}
.flex {
  display: flex;
  justify-content: center;
  padding: 25px;
}
.flex > div {
  width: 150px;
  height: 150px;
  cursor: pointer;
}
.flex img {
  border-radius: 100%;
}
</style>
