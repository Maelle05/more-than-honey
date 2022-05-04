<template>
  <div id="app">
    <canvas class="webgl"/>
    <MobileVersion class="mobile" v-if="viewportW < 850"/>
    <div class="ui" v-if="viewportW > 851">
      <Loading/>
      <HomeButton/>
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script lang="js">
import * as main from './main'
import Loading from '@/components/ui/Loading'
import HomeButton from '@/components/ui/HomeButton'
import MobileVersion from '@/components/MobileVersion'

export default {
  components: {
    MobileVersion,
    Loading,
    HomeButton
  },
  data() {
    return {
      viewportW: window.innerWidth,
      viewportH: window.innerHeight
    }
  },
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
  }

  .mobile {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
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