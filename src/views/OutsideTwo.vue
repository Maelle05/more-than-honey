<template>
  <div class="outsideTwo">
    <TimelineComponent/>
    <Button label="Suivant" to="/raceGame"/>
  </div>
</template>

<script>
import Button from '@/components/ui/PrimaryButton'
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