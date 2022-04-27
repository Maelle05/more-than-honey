<template>
  <div class="pollenGame">
    <h1>Pollen Game</h1>
    <TimelineComponent/>
    <Button label="Suivant" to="/outsideTwo"/>
  </div>
</template>

<script lang="js">
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
    setTimeout(() => {
      manager.loader.classList.add('loaded')
    }, 500)
  }
}
</script>

<style scoped lang="scss">

</style>