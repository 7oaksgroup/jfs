<template>
  <div class="register">
    <Header></Header>
    <div class="container">
      <div class="image"></div>
      <div class="form">
          Chill out
      </div>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import Header from '@/components/Header'
import Button from '@/components/Button'

export default {
  name: 'Register',
  components: {
    Header,
    Button
  },
  beforeCreate() {
    // const { code } = this.$route.query
    // this.$store.dispatch('facebookConnect', {code})
    const search = window.location.search.substr(1)
    this.$store.dispatch('facebookConnect', {search})
  },
  data() {
    return {
      msg: 'This is a test component'
    }
  },
  methods: {
    register(e) {
      e.preventDefault()
      this.$store.dispatch('register')
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.currentUser
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  width: 1400px;
  margin: auto;
  text-align: center;
}
.image {
  height: 200px;
  width: 250px;
  background-image: url('../assets/form.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
}
.form {
  display: inline-block;
  border: 2px solid #000;
  padding: 15px 25px;
  width: 225px;
  background-color: #fff;
}
input {
  display: block;
  height: 25px;
  width: 100%;
  margin: 15px 0;
}
</style>
