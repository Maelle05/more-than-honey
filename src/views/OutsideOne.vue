<template>
  <div class="outsideOne">
    <TimelineComponent/>
    <Button label="Suivant" to="/pollenGame"/>
  </div>
</template>

<script>
import Button from '@/components/ui/PrimaryButton'
import TimelineComponent from '@/components/ui/TimelineComponent'

export default {
  name: 'OutsideOne',
  components: {
    Button,
    TimelineComponent
  }
}
</script>

<style scoped lang="scss">

</style>