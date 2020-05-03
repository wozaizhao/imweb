<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Push from 'push.js'

export default {
  name: 'App',
  created () {
    Push.Permission.request()
  }
}
</script>

<style>
#app{
  height:100%;
}
</style>
