<template>
  <div class="tutoScreen" ref="tuto">
    <lottie-player
        autoplay
        background="transparent"
        loop
        mode="normal"
        :src="path"
        style="width: 320px">
    </lottie-player>
  </div>
</template>

<script lang="js">
import '@lottiefiles/lottie-player'
import Listener from '@/webgl/utils/Listener'

export default {
  name: 'Tuto',
  props: {
    path: {
      required: true,
      default: '/'
    },
    listener: {
      required: true,
      default: 'mouseClick'
    }
  },
  mounted() {
    const listener = new Listener()
      listener.on(this.listener, () => {
        if(this.$refs.tuto) {
          if (this.listener === 'mouseClick') {
            this.$refs.tuto.classList.add('click')
          }
          this.$refs.tuto.classList.add('hidden')
        }
      })
  }
}
</script>

<style scoped lang="scss">
.tutoScreen {
  background: #000000;
  height: 100vh;
  width: 100vw;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  visibility: visible;
  opacity: 0.80;
  transition: opacity .8s;
}

.click {
  transition: 0.1s !important;
}

.hidden {
  opacity: 0;
  pointer-events: none;
}
</style>