<template>
  <div class="pollenGame">
    <TimelineComponent/>
    <Button label="Suivant" to="/outsideTwo"/>
    <div class="gaugeBar" ref="gaugeBar">
      <div class="gauge"></div>
      <span class="label">0</span>
    </div>
  </div>
</template>

<script lang="js">
import PollenGame from '@/webgl/scenes/PollenGameScene'
import Button from '@/components/ui/PrimaryButton'
import TimelineComponent from '@/components/ui/TimelineComponent'
import WebGl from '@/webgl/webglManager'

export default {
  name: 'PollenGame',
  components: {
    TimelineComponent,
    Button
  },
  mounted() {
    const manager =  new WebGl()
    const webglInstance = new PollenGame()
    webglInstance.setDOM(this.$refs.gaugeBar)

    setTimeout(() => {
      manager.loader.classList.add('loaded')
    }, 500)
  }
}
</script>

<style scoped lang="scss">
.pollenGame{
  position: absolute;
  .gaugeBar {
    background-color: white;
    width: 50px;
    height: 30vh;
    position: absolute;
    top: 10vh;
    left: 30px;
    border-radius: 10px;

    .label{
      position: absolute;
      bottom: 2%;
      color: black;
      display: block;
      width: 100%;
      text-align: center;
      transition-property: bottom color;
      transition-duration: 2s;
    }

    .gauge{
      position: absolute;
      border-radius: 0 0 10px 10px;
      background-color: goldenrod;
      width: 100%;
      height: 0%;
      bottom: 0;
      transition-property: height border-radius;
      transition-duration: 2s;
    }
  }
}

</style>