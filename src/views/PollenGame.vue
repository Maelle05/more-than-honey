<template>
  <div class="pollenGame" ref="pollenGameUI" >
    <TimelineComponent/>
    <!-- <Tuto path="/lottie/clic.json" listener="mouseClick"/> -->
    <Button label="Suivant" to="/outsideTwo"/>
    <div class="chrono">
      <p>00</p>
    </div>
    <div class="loaderPollen hidden">
      <p>00</p>
    </div>
    <div class="count">
      <p>00</p>
    </div>
  </div>
</template>

<script lang="js">
import PollenGame from '@/webgl/scenes/PollenGameScene'
import Button from '@/components/ui/PrimaryButton'
import TimelineComponent from '@/components/ui/TimelineComponent'
import WebGl from '@/webgl/webglManager'
// import Tuto from '@/components/ui/Tuto'

export default {
  name: 'PollenGame',
  components: {
    TimelineComponent,
    Button,
    // Tuto
  },
  mounted() {
    const manager =  new WebGl()
    const webglInstance = new PollenGame()
    webglInstance.setDOM(this.$refs.pollenGameUI)

    setTimeout(() => {
      manager.loader.classList.add('loaded')
    }, 500)
  }
}
</script>

<style scoped lang="scss">
.pollenGame{
  width: 100%;
  height: 100%;
  cursor: none;

  .chrono {
    position: absolute;
    right: 110px;
    top: 64px;
    background-color: red;
  }

  .count {
    position: absolute;
    left: 110px;
    bottom: 64px;
    color: white;
  }

  .loaderPollen {
    position: absolute;
    background-color: red;
    opacity: 1;
    transition: opacity .3s;

    &.hidden{
      opacity: 0;
    }
  }
}

</style>