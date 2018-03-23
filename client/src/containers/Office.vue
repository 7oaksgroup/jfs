<template>
  <div class="facebook">
    <Header>
      <a @click="logout">Logout</a>
    </Header>
    <h1>Welcome, {{firstName}}!</h1>
    <div class="box">
      <p class="italics">Welcome to the Just For Stylists Community!</p>
      <p class="bold">Just For Stylists was formed to: </p>
      <ul class="intro-list">
        <li>Support a worldwide community exclusively for beauty professionals</li>
        <li>Provide world-class training from leading experts on beauty, social media and personal and professional development</li>
        <li>Develop salon-exclusive, high-quality and safe hair care and beauty products</li>
        <li>Have a lot of fun (including sponsored events, trips, and once-in-a-lifetime experiences)! </li>
      </ul>
      <p class="bold">So, welcome to the JFS Family! Let's celebrate and make this world more beautiful together!</p>
    </div>
    <div class="welcome-message">
      <div class="main-avatar">
        <img width="100" height="100" :src="avatar"/>
      </div>
      <p class="bold">Do you know other beauty professionals that would love to be a part of the Just For Stylists Community? 
      Expand your circle of influence by sharing the invite link below:</p>
      <div class="share-link">
        <small v-if="!copied">Click to copy:</small>
        <small v-if="copied">Copied!</small>
        <input v-model="safeShareUrl" readonly="readonly" @click="copy"/>
      </div>
    </div>
    <div class="box">
      <p class="italics">Want more ways to stay connected and contribute to our growing community?</p>
      <p class="bold">Join our Exclusive Facebook Group!</p>
      <Button href="https://www.facebook.com/groups/142418766393701/">Just For Stylists on Facebook</Button>
    </div>
    <div class="box">
      <p class="bold">Community growth over the last 30 days.</p>
    </div>
    <line-chart class="growth-chart" :data="growth" :colors="['#e6d878']"></line-chart>
    <div class="box grey">
      <Backbar :stylists="getStylists" :leaderboard="leaderboard"></Backbar>
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
      <p class="bold">Your Circle of Influence: {{influenceCount}}</p>
      <p>Share your link with other beauty professionals and come back here to watch your Circle of Influence grow!</p>
      <div class="influence">
        <div v-for="stylist in influence" :key="stylist.id">
          <img class="avatar" width="75" height="75" :src="`https://graph.facebook.com/${stylist.facebook_id}/picture?type=large`"/>
          <p>{{stylist.first_name}} {{stylist.last_name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import Header from '@/components/Header'
import Button from '@/components/Button'
import Backbar from '@/components/Backbar'

export default {
  name: 'Office',
  components: {
    Button,
    Header,
    Backbar
  },
  data() {
    return {
      copied: false
    }
  },
  mounted() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push('/')
      return
    }
    this.$store.dispatch('getInfluence')
    this.$store.dispatch('getLeaderboard')
    this.$store.dispatch('getReports')
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.push('/')
    },
    copy(event) {
      let el = event.target
      let oldContentEditable = el.contentEditable
      let oldReadOnly = el.readOnly
      let range = document.createRange()

      el.contenteditable = true
      el.readonly = false
      range.selectNodeContents(el)

      let s = window.getSelection()
      s.removeAllRanges()
      s.addRange(range)

      el.setSelectionRange(0, 999999)

      el.contentEditable = oldContentEditable
      el.readOnly = oldReadOnly

      document.execCommand('copy')
      this.copied = true
      setTimeout(() => {
        this.copied = false
      }, 3000)
    }
  },
  computed: {
    firstName() {
      return this.$store.getters.firstName
    },
    ...mapState({
      growth: state => state.reports.growth ? state.reports.growth.map($ => [new Date($.date), $.count]) : [],
      currentUser: state => state.currentUser,
      safeShareUrl: state =>
        `${window.location.origin}/invite?inviteCode=${state.currentUser.id}`,
      inviteCode: state => state.inviteCode,
      count: state => state.count,
      influence: state => state.influence,
      influenceCount: state => state.influence.length,
      avatar: state =>
        `https://graph.facebook.com/${
          state.currentUser.facebook_id
        }/picture?type=large`,
      getStylists: state =>
        state.influence.filter(i => ~~i.sponsor_id === state.currentUser.id)
          .length,
      leaderboard: state => state.leaderboard
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
.italics.small {
  font-size: 18px;
}
.growth-chart{
  max-width: 1100px;
  margin: auto;
}

.intro-list {
}
.intro-list li {
  margin: 15px 0;
}

input {
  border: 1px solid #e6d878;
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
.box.grey {
  background-color: #515151;
  padding: 25px;
  box-shadow: 0px 1px 1px 1px #ababab;
  color: #fff;
}

.welcome-message {
  position: relative;
  max-width: 550px;
  background-color: #515151;
  margin: 75px auto 0 auto;
  padding: 45px 25px;
  box-shadow: 0px 1px 1px 1px #ababab;
  color: #fff;
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
  border: 7px solid #515151;
}
.main-avatar img {
  border-radius: 100%;
  border: 7px solid #fff;
}
.banner {
  background-color: #515151;
  padding: 0 45px;
  display: flex;
  align-items: center;
  box-shadow: 0px 1px 1px 1px #ababab;
  flex-wrap: wrap;
  color: #fff;
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
  border: solid 20px #e6d878;
  width: 200%;
  height: 200%;
  border-radius: 50%;
  transform: skewX(-30deg);
  content: '';
}
.arc.shadow:before {
  border: solid 1px #000;
}
.arc.top {
  transform: rotate(45deg) skewX(30deg);
  animation: rotate-top 45s infinite linear;
}
.arc.top.shadow {
  transform: rotate(44deg) skewX(29deg);
  z-index: 0;
}
.arc.top2 {
  transform: rotate(93deg) skewX(30deg);
  animation: rotate-top2 45s infinite linear;
}
.arc.top2.shadow {
  transform: rotate(92deg) skewX(29deg);
  z-index: 0;
}
.arc.bottom {
  transform: rotate(-150deg) skewX(30deg);
  animation: rotate-bottom 20s infinite linear;
}
.arc.bottom.shadow {
  transform: rotate(-150deg) skewX(31deg);
  z-index: 0;
}
.count {
  padding: 65px 50px;
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
  border: 4px solid #e6d878;
}

@keyframes rotate-bottom {
  0% {
    transform: rotate(-150deg) skewX(30deg);
  }
  100% {
    transform: rotate(210deg) skewX(30deg);
  }
}

@keyframes rotate-top {
  0% {
    transform: rotate(45deg) skewX(30deg);
  }
  100% {
    transform: rotate(-316deg) skewX(30deg);
  }
}
@keyframes rotate-top2 {
  0% {
    transform: rotate(93deg) skewX(30deg);
  }
  100% {
    transform: rotate(-268deg) skewX(30deg);
  }
}
</style>
