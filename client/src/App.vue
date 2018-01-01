<script>
export default {
  name: 'app',
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
</style>
