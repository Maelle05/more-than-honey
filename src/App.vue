<template>
  <div id="app">
    <canvas class="webgl"/>
    <div class="ui">
      <div id="nav">
        <router-link to="/honeyIntro">Honey Intro</router-link>
        |
        <router-link to="/hive">Hive</router-link>
        |
        <router-link to="/outsideOne">Outside one</router-link>
        |
        <router-link to="/pollenGame">Pollen Game</router-link>
        |
        <router-link to="/outsideTwo">Outside two</router-link>
        |
        <router-link to="/raceGame">Race Game</router-link>
        |
        <router-link to="/ending">Ending</router-link>
        |
        <router-link to="/credits">Credits</router-link>
      </div>
      <transition
          name="fade"
          mode="out-in"
      >
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script lang="js">
import * as main from './main'

export default {
  watch: {
    $route(to) {
      main.change(to.name)
    }
  }
}
</script>

<style lang="scss">
#app {
  canvas.webgl {
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
    z-index: 0;
  }

  .ui {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
    height: 100vh;
    width: 100vw;

    h1, p {
      color: aliceblue;
    }

    #nav, a {
      color: powderblue;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 0.3s;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }
}

</style>