<template>
  <div id="app">
<!--    <div id="nav">-->

<!--      <router-link class="router-link" v-for="path of paths" :to="path.to" :key="path.to">-->
<!--        {{ path.name }}-->
<!--      </router-link>-->
<!--    </div>-->
    <router-view />
  </div>
</template>

<script>


export default {
  name: 'App',
  data () {
    return {
      paths: [
        {
          to: '/',
          name: 'Zdjęcia'
        },
        {
          to: '/stretch-histogram',
          name: 'Histogram'
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
  },
  mounted(){
    window.customAPI.ipcRenderer.customOn('change-route', (routeName) => {
      // console.log('routeName')
      // console.log(routeName)
      // console.log()
      // console.log(`Go to route: ${routeName}`)
      if(this.$route.name!==routeName)
      {
        const routePath = this.$router.resolve({name:routeName}).resolved.path
        this.$router.push(routePath)
      }
      // console.log(this.$router)
    })
  },
  beforeDestroy () {
    window.customAPI.ipcRenderer.customRemoveAllListeners('change-route')
  },
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

.router-link {
  text-decoration: none;
}
</style>
