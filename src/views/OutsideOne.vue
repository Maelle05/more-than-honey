<template>
  <div class="outsideOne">
    <TimelineComponent/>
    <Tuto path="/lottie/scroll.json" listener="scroll"/>
    <Button label="Suivant" to="/pollenGame"/>
  </div>
</template>

<script>
import Button from '@/components/ui/PrimaryButton'
import TimelineComponent from '@/components/ui/TimelineComponent'
import Tuto from '@/components/ui/Tuto'

export default {
  name: 'OutsideOne',
  components: {
    Button,
    TimelineComponent,
    Tuto
  }
}
</script>

<style scoped lang="scss">

</style>