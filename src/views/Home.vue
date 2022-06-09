<template>
  <div class="home" ref="container">
   
    <div class="home__intro" ref="intro" >
      <img class="logo" src="@/assets/images/logo.svg" alt="white logo of the project 'more than honey'">
      <p class="u-uppercase" >Le pouvoir des abeilles</p>
      <div class="button" ref="button" @click="playCinematique">
        <span>Commencer l'expérience</span>
      </div>
    </div>

    <CursorNext to="/hive" ref="cursorNext"/>
    <div class="subtitles--wrapper"></div>
    <div class="headphones center" ref="headphones">
      <img src="/images/loader/headphone.svg" alt="icon for sound, headphone">
      <p>L'expérience nécessite l'activation du son</p>
    </div>
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
      // document.querySelector('.HomeButton').style.opacity = 1
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
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
    
    p{
      text-align: center;
      margin-top: -17px;
    }

    .button {
      z-index: 50;
      background: #1A1A1A40;
      border: 2px solid $white;
      border-radius: 8px;
      transition: 0.3s;
      display: inline-block;
      cursor: pointer;
      margin-top: 60px;

      span {
        font-size: 24px;
        display: block;
        padding: 8px 24px;
        font-weight: 500;
        font-family: 'RoadRage', sans-serif;
        color: $white;
      }

      &:hover {
        span {
          color: $blueGreen;
        }
        background: $white;
      }
    }
  }

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

  .center {
    position: fixed;
    bottom: 6vh;
    right: 50%;
    transform: translateX(50%);
  }

  .subtitles--wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;

    p{
      // font-family: 'Lato', sans-serif;
      font-family: 'RoadRage', sans-serif;
      font-size: 45px;
      // text-transform: uppercase;
      text-align: center;
        span{
          animation: .3s ease-in fadeIn;
          text-shadow: 3px 3px 15px rgba(0, 0, 0, 0.377);
        }
    }
  }


  @keyframes fadeIn {
    from { opacity: 0 }
    to   { opacity: 1 }
  }
}
</style>
