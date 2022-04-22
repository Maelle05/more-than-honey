<template>
  <div class="pollenGame">
    <h1>Pollen Game</h1>
    <Button label="Next" to="/outsideTwo"/>
  </div>
</template>

<script lang="js">
import Button from '@/components/ui/Button'
import WebGl from '@/webgl/webglManager'

export default {
  name: 'PollenGame',
  components: {
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