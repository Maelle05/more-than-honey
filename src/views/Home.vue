<template>
  <div class="home">
    <img class="home__background" src="@/assets/images/homeBackground.png" alt="background of the home page, trees and flower">
    <div class="home__intro">
      <img class="logo" src="@/assets/images/logo.svg" alt="white logo of the project 'more than honey'">
      <p class="u-uppercase">Le pouvoir des abeilles</p>
    </div>
    <Button to="/honeyIntro" label="Commencer l'expérience"/>
  </div>
</template>

<script>
import Button from '@/components/ui/Button'
import WebGl from '@/webgl/webglManager'

export default {
  name: 'Home',
  components: {
    Button
  },
  mounted() {
    const manager =  new WebGl()
    setTimeout(() => {
      manager.loader.classList.add('loaded')
      localStorage.setItem('isHomePassed', true)
    }, 500)
    
  }
}
</script>

<style lang="scss">
.home {
  z-index: 5;
  height: 100vh;
  &__background {
    width: 100%;
    height: 100%;
  }

  &__intro {
    position: fixed;
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
