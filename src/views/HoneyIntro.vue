<template>
  <div class="honeyIntro">
    <Button to="/hive" label="Suivant"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Button from '@/components/ui/PrimaryButton'
import WebGl from '@/webgl/webglManager'

export default {
  name: 'HoneyIntro',
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