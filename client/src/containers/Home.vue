<template>
  <div class="home">
    <Header :reverse="true"></Header>
    <div class="content">
      <div class="backdrop">
        <h1>
          <span class="break">If you are here,</span>
          <span>you know why.</span>
        </h1>
      </div>
      <div v-if="!isRegistered">
        <Button href="/login/facebook">{{action}}</Button>
      </div>
      <div v-if="isRegistered">
        <Button href="/office">{{office}}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Button from '@/components/Button'
import Header from '@/components/Header'

export default {
  name: 'Home',
  components: {
    Button,
    Header
  },
  data() {
    return {
      action: 'get started',
      office: 'Enter'
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
    }),
    isRegistered() {
      return this.$store.getters.isRegistered
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-family: Palatino, 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua',
    Georgia, serif;
  font-style: italic;
  color: white;
}
.home {
  background: url('../assets/salon.jpg') center left no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100vw;
}
.content {
  width: 100%;
  max-width: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.backdrop {
  padding: 25px 50px;
  background-color: rgba(0, 0, 0, 0.8);
  margin-bottom: 50px;
}
.break {
  display: block;
}
.break::before {
  content: attr(data-text);
  background: black;
}
</style>
