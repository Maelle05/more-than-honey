<template>
  <div ref="loadingScreen" class="loading">
<!--    <div class="lds-ripple"><div></div><div></div></div>-->
    <svg viewBox="0 0 340 333">
<!--      en attendant le bon svg de la part des designers -->
      <path class="path" fill="black" stroke="white" stroke-width="4" d="M66.039,133.545c0,0-21-57,18-67s49-4,65,8
	s30,41,53,27s66,4,58,32s-5,44,18,57s22,46,0,45s-54-40-68-16s-40,88-83,48s11-61-11-80s-79-7-70-41
	C46.039,146.545,53.039,128.545,66.039,133.545z"/>

    </svg>
    <p class="u-uppercase loading__text">Chargement ...</p>

    <div class="headphones">
      <img src="/images/loader/headphone.svg" alt="icon for sound, headphone">
      <p>Use headphones for better experience</p>
    </div>
  </div>
</template>

<script lang="js">
import WebGl from '@/webgl/webglManager'

export default {
  name: 'Loading',
  props: {
    isHome: {
      required: false,
      default: false
    }
  },
  mounted() {
    const manager =  new WebGl()
    manager.getLoaderRef(this.$refs.loadingScreen)
  }
}
</script>

<style scoped lang="scss">
svg {
  height: 165px;
}
.path {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: dash 1s linear infinite;
}

@keyframes dash {
  from {
    stroke-dashoffset: 822;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.loading {
  height: 100vh;
  width: 100vw;
  background: black;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: 1;
  visibility: visible;
  z-index: 5;

  .headphones {
    position: absolute;
    bottom: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      margin-bottom: 16px;
    }
  }

  &__text {
    font-family: 'RoadRage', sans-serif;
    font-size: 32px;
    color: $white;
  }
}

.loaded {
  opacity: 0;
  visibility: hidden;
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


</style>