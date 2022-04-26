<template>
  <div class="outsideTwo">
    <h1>Outside Two</h1>
    <TimelineComponent/>
    <Button label="Suivant" to="/raceGame"/>
  </div>
</template>

<script>
import Button from '@/components/ui/Button'
import TimelineComponent from '@/components/ui/TimelineComponent'

export default {
  name: 'OutsideTwo',
  components: {
    TimelineComponent,
    Button
  }
}
</script>

<style scoped lang="scss">

</style>