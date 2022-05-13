<template>
  <div class="tutoScreen" ref="starter">
    <lottie-player
        autoplay
        background="transparent"
        mode="normal"
        src="/lottie/game/321.json"
        style="width: 320px">
    </lottie-player>
  </div>
</template>

<script lang="js">
import '@lottiefiles/lottie-player'

export default {
  name: 'Starter',
  mounted() {
    setTimeout(() => {
      this.$refs.starter.classList.add('hidden')
    }, 3200)
  },
  methods: {
    // startLottieAnimation() {
    //   this.$emit('start-lottie-animation')
    // }
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
  transition: 0.8s;
}

.click {
  transition: 0.1s !important;
}

.hidden {
  visibility: hidden;
}
</style>