<template>
  <div class="tutoScreen hidden starter" ref="starter">
    <lottie-player
        background="transparent"
        mode="normal"
        src="/lottie/game/321.json"
        style="width: 320px"
        class="lottie123"
        >
    </lottie-player>
  </div>
</template>

<script lang="js">
import '@lottiefiles/lottie-player'


export default {
  name: 'Starter',
  mounted(){
    // setTimeout(() => {
    //   this.$refs.starter.classList.add('hidden')
    // }, 3200)
  },
  methods: {
    startLottieAnimation(){
      const player = document.querySelector('.lottie123')
      const container = document.querySelector('.tutoScreen.starter')
      container.classList.remove('hidden')
      player.play()
      player.addEventListener('complete', function(){
        player.stop()
        container.classList.add('hidden')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tutoScreen {
  // background: #000000;
  height: 100vh;
  width: 100vw;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  visibility: visible;
  opacity: 1;
  transition: 0.8s;
}

.click {
  transition: 0.1s !important;
}

.hidden {
  display: none;
}
</style>