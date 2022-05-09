<template>
  <div class="tutoScreen" ref="tuto">
    <lottie-player
        autoplay
        background="transparent"
        loop
        mode="normal"
        src="/lottie/scroll.json"
        style="width: 320px">
    </lottie-player>
  </div>
</template>

<script lang="js">
import '@lottiefiles/lottie-player'
import Listener from '@/webgl/utils/Listener'

export default {
  name: 'Tuto',
  mounted() {
    const listener = new Listener()
    listener.on('scroll', () => {
      if(this.$refs.tuto) {
        this.$refs.tuto.classList.add('hidden')
      }
    })
  }

}
</script>

<style scoped lang="scss">
.tutoScreen {
  background: #00000090;
  height: 100vh;
  width: 100vw;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  visibility: visible;
  transition: 1s;
}

.hidden {
  visibility: hidden;
  display: none;
}
</style>