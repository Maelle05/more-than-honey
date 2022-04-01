<template>
  <div id="app">
    <canvas class="webgl"/>
    <div class="ui">
      <TimelineComponent/>
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script lang="js">
import * as main from './main'
import TimelineComponent from '@/components/ui/TimelineComponent'

export default {
  components: {
    TimelineComponent
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