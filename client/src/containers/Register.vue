<template>
  <div class="register">
    <Header></Header>
    <div class="container">
      <div class="image"></div>
      <div class="form">
          <form @submit="register">
            <p>Let us know who you are!</p>
            <input type="text" placeholder="First Name" v-model="currentUser.firstName" required/>
            <input type="text" placeholder="Last Name" v-model="currentUser.lastName" required/>
            <input type="email" placeholder="Email" v-model="currentUser.email" required/>
            <input type="text" placeholder="Zip Code" v-model="currentUser.zip" required/>
            <input type="submit" value="submit"/>
          </form>
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
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push('/')
    }
    if (!this.$store.getters.getFriend) {
      this.$router.push('/findfriend')
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
  text-align: center;
}
.image {
  height: 369px;
  width: 550px;
  background-image: url('../assets/form.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
  vertical-align: middle;
}
.form {
  display: inline-block;
  border: 2px solid #000;
  padding: 15px 25px;
  width: 225px;
  background-color: #fff;
  vertical-align: middle;
  margin-left: -5%;
}

@media (max-width: 850px) {
  .image {
    height: 100vh;
    width: 100vw;
    background-image: url('../assets/form.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    display: inline-block;
    vertical-align: middle;
    background-position: center;
  }
  .form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

input {
  display: block;
  height: 25px;
  width: 100%;
  margin: 15px 0;
  padding-left: 10px;
}
input[type='submit'] {
  text-decoration: none;
  color: #fff;
  background-color: #ff69b4;
  padding: 0 30px;
  border-radius: 12px;
  box-shadow: 2px 2px 6px -3px #000;
  border: none;
  width: inherit;
  margin: auto;
  cursor: pointer;
}
</style>
