<template>
  <div class="outsideOne">
    <TimelineComponent/>
    <Button label="Suivant" to="/PollenGame"/>
  </div>
</template>

<script>
import Button from '@/components/ui/Button'
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