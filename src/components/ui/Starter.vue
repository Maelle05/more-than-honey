<template>
  <div class="starterScreen hidden" ref="starter">
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
  methods: {
    startLottieAnimation(){
      const player = document.querySelector('.lottie123')
      const container = document.querySelector('.starterScreen')
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
.starterScreen {
  height: 100vh;
  width: 100vw;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  visibility: visible;
  transition: 0.8s;
}

.hidden {
  display: none;
}
</style>