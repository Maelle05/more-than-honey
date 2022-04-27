<template>
  <div class="raceGame">
    <h1>Race Game</h1>
    <TimelineComponent/>
    <Button label="Suivant" to="/ending"/>

  </div>
</template>

<script lang="js">
import Button from '@/components/ui/PrimaryButton'
import TimelineComponent from '@/components/ui/TimelineComponent'

export default {
  name: 'RaceGame',
  components: {
    TimelineComponent,
    Button
  }
}
</script>

<style scoped lang="scss">

</style>