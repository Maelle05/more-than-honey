<template>
  <div ref="loadingScreen" class="loading">
    <div class="lds-ripple"><div></div><div></div></div>
  </div>
</template>

<script lang="js">
import WebGl from '@/webgl/webglManager'

export default {
  name: 'Loading',
  mounted() {
    const manager =  new WebGl()
    manager.getLoaderRef(this.$refs.loadingScreen)
  }
}
</script>

<style scoped lang="scss">
.loading {
  height: 100vh;
  width: 100vw;
  background: black;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  //transition: 0.3s;
  z-index: 5;
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0;
    left: 0;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}

.loaded {
  opacity: 0;
  visibility: hidden;
}
</style>