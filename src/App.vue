<template>
  <div id="app">
    <div id="nav">

      <router-link v-for="path of paths" :to="path.to" :key="path.to">
        {{ path.name }}
      </router-link>
      <!--      <router-link to="/">Home</router-link>-->
      <!--      |-->
      <!--      <router-link to="/files">Pliki</router-link>-->
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      paths: [
        {
          to: '/',
          name: 'Home'
        },
        {
          to: '/stretch-histogram',
          name: 'StretchHistogram'
        },
        {
          to: '/files',
          name: 'Pliki'
        },
        {
          to: '/test',
          name: 'Test'
        }
      ]
    }
  }
}

</script>

<style lang="scss">
//@import 'node_modules/bootstrap/scss/bootstrap.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
