<template>
  <div id="app">
    <canvas class="webgl"/>
    <div class="point"></div>
    <div class="ui">
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/fox">Fox</router-link> |
        <router-link to="/bee">Bee</router-link>
        <br>
        <br>
        <router-link to="/honeyIntro">Honey Intro</router-link> |
        <router-link to="/loading">Loading</router-link> |
        <router-link to="/hive">Hive</router-link> |
        <router-link to="/outside/one">Outside one</router-link> |
        <router-link to="/pollenGame">Pollen Game</router-link> |
        <router-link to="/outside/two">Outside two</router-link> |
        <router-link to="/raceGame">Race Game</router-link> |
        <router-link to="/ending">Ending</router-link> |
        <router-link to="/credits">Credits</router-link>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
}
html,
body {
  overflow: hidden;
}

#app{
  canvas.webgl{
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
    z-index: 0;
  }

  .ui{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    h1, p {
      color: aliceblue;
    }

    #nav, a{
      color: red;
    }
  }
}

</style>

<script>
import * as main from './main'

export default {
  watch:{
    $route (to){
        main.change(to.name)
    }
  }
}
</script>