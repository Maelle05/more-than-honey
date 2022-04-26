<template>
  <div class="ending">
    <h1>Ending</h1>
    <Button label="Recommencer" to="/"/>
    <TimelineComponent/>
  </div>
</template>

<script lang="js">
import Button from '@/components/ui/Button'
import TimelineComponent from '@/components/ui/TimelineComponent'

export default {
  name: 'Home',
  components: {
    TimelineComponent,
    Button
  }
}
</script>

<style scoped lang="scss">

</style>