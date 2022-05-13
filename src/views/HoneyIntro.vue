<template>
  <div class="honeyIntro">
    <TimelineComponent/>
  </div>
</template>

<script>
import WebGl from '@/webgl/webglManager'
import TimelineComponent from '@/components/ui/TimelineComponent'

export default {
  name: 'HoneyIntro',
  components: {
    TimelineComponent
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