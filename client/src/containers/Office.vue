<template>
  <div class="facebook">
    <Header>
      <a @click="logout">Logout</a>
    </Header>
    <h1>Welcome, {{firstName}}!</h1>
    <div class="welcome-message">
      <div class="main-avatar">
        <img width="100" height="100" :src="avatar"/>
      </div>
      <p class="bold">Do you know other beauty professionals that would love to be a part of the Just Stylsust Community? 
      Expand your circle of influence by sharing the invite link below:</p>
      <div class="share-link">
        <input type="text" v-model="safeShareUrl" readonly/>
      </div>
    </div>
    <div class="box">
      <p class="italics">Want more ways to stay connected and contribute to our growing community?</p>
      <p class="bold">Join the facebook group!</p>
      <Button href="https://www.facebook.com/groups/142418766393701/">Just for Stylists on Facebook</Button>
    </div>
    <div class="banner">
      <div>
        <p class="italics">Number of owners, dreamers, doers:</p>
      </div>
      <div>
        <div class="circle">
          <div class="top arc"></div>
          <div class="top arc shadow"></div>
          <div class="top2 arc"></div>
          <div class="top2 arc shadow"></div>
          <div class="count">{{count}}</div>
          <div class="bottom arc"></div>
          <div class="bottom arc shadow"></div>
        </div>
      </div>
    </div>
    <div class="box">
      <p class="bold">Your circle of influence</p>
      <div class="influence">
        <div v-for="stylist in influence" :key="stylist.id">
          <p>{{stylist.first_name}}{{stylist.last_name}}</p>
          <img class="avatar" width="75" height="75" :src="stylist.avatar_url"/>
        </div>
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
      influence: state => state.influence,
      avatar: state =>
        `http://graph.facebook.com/${
          state.currentUser.facebook_id
        }/picture?type=large`
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.italics {
  font-family: Palatino, 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua',
    Georgia, serif;
  font-style: italic;
  font-size: 24px;
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
p.bold {
  font-size: 22px;
  font-weight: 600;
  line-height: 30px;
}
.box {
  max-width: 550px;
  margin: 0 auto 75px auto;
}
.welcome-message {
  position: relative;
  max-width: 550px;
  background-color: #efefef;
  margin: 75px auto 0 auto;
  padding: 45px 25px;
  box-shadow: 0px 1px 1px 1px #ababab;
}
.main-avatar {
  position: absolute;
  top: -50px;
  left: 50%;
  border-radius: 100%;
  width: 114px;
  height: 114px;
  background: transparent;
  transform: translateX(-50%);
  border: 7px solid #efefef;
}
.main-avatar img {
  border-radius: 100%;
  border: 7px solid #fff;
}
.banner {
  background-color: #efefef;
  padding: 0 45px;
  display: flex;
  align-items: center;
  box-shadow: 0px 1px 1px 1px #ababab;
  flex-wrap: wrap;
}
.banner > div {
  flex: 1;
}
.circle {
  position: relative;
  margin: 30px auto;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: transparent;
}
.arc {
  overflow: hidden;
  position: absolute;
  top: -1em;
  right: 50%;
  bottom: 50%;
  left: -1em;
  transform-origin: 100% 100%;
  z-index: 1;
}
.arc:before {
  box-sizing: border-box;
  display: block;
  border: solid 20px #ff69b4;
  width: 200%;
  height: 200%;
  border-radius: 50%;
  transform: skewX(-30deg);
  content: '';
}
.arc.shadow:before {
  border: solid 20px #000;
}
.arc.top {
  transform: rotate(45deg) skewX(30deg);
}
.arc.top.shadow {
  transform: rotate(44deg) skewX(29deg);
  z-index: 0;
}
.arc.top2 {
  transform: rotate(93deg) skewX(30deg);
}
.arc.top2.shadow {
  transform: rotate(92deg) skewX(29deg);
  z-index: 0;
}
.arc.bottom {
  transform: rotate(-150deg) skewX(30deg);
}
.arc.bottom.shadow {
  transform: rotate(-150deg) skewX(31deg);
  z-index: 0;
}
.count {
  padding: 50px;
  font-size: 65px;
  font-weight: 700;
}
.influence {
  display: flex;
  flex-wrap: wrap;
}
.influence > div {
  flex: 1;
}
.avatar {
  border-radius: 100%;
  border: 4px solid #ff69b4;
}
</style>
