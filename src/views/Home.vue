<template>
  <div class="home" ref="container">
    <!-- <img class="home__background" src="@/assets/images/homeBackground.png" alt="background of the home page, trees and flower"> -->
    <div class="home__intro" ref="intro" >
      <img class="logo" src="@/assets/images/logo.svg" alt="white logo of the project 'more than honey'">
      <p class="u-uppercase" >Le pouvoir des abeilles</p>
    </div>

    <div class="button center" ref="button" @click="playCinematique">
      <p>Commencer l'expérience</p>
    </div>
    <CursorNext to="/hive" ref="cursorNext"/>
    <div class="subtitles--wrapper"></div>
  </div>
</template>

<script>
import HomeScene from '@/webgl/scenes/HomeScene'
import CursorNext from '@/components/ui/CursorNext'

export default {
  name: 'Home',
  components: {
    CursorNext
  },
  mounted() {
    this.scene = new HomeScene()
    this.scene.initCursorComponent(this.$refs.cursorNext)
  },
  methods: {
    playCinematique(){
      this.scene.play(this.$refs)
      this.$refs.button.style.pointerEvents = 'none'
      this.$refs.container.classList.add('u-cursor-hidden')
    }
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
    opacity: 1;
    transform: translate(-50%, -50%);

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    p{
      margin-top: -17px;
    }
  }

  .button {
    z-index: 50;
    background: #1A1A1A40;
    border: 2px solid $white;
    border-radius: 8px;
    transition: 0.3s;
    display: inline-block;
    cursor: pointer;

    p {
      font-size: 24px;
      display: block;
      padding: 8px 24px;
      font-weight: 500;
      font-family: 'RoadRage', sans-serif;
      color: $white;
    }

    &:hover {
      p {
        color: $blueGreen;
      }
      background: $white;
    }
  }

  .center {
    position: fixed;
    bottom: 15vh;
    right: 50%;
    transform: translateX(50%);
  }

  .subtitles--wrapper{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;

    p{
      font-family: 'Lato', sans-serif;
      font-size: 20px;
    }
  }
}
</style>
