<script>
export default {
  name: 'app',
  beforeCreate() {
    console.log(process.env.API_URL)
    this.$store.dispatch('loadUser')
    const friend = this.$route.query.friend || localStorage.getItem('friend')
    if (friend) {
      this.$store.dispatch('saveFriend', friend)
    }
  },
  render() {
    return (
      <div id="app">
        <router-view />
      </div>
    )
  }
}
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Lato', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.container {
  max-width: 1440px;
  margin: auto;
  position: relative;
}
.button {
  text-decoration: none;
  color: #fff;
  background-color: #ff69b4;
  padding: 10px 30px;
  border-radius: 12px;
  box-shadow: 2px 2px 6px -3px #000;
  cursor: pointer;
}
</style>
