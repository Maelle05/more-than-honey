<template>
  <div class="outsideOne">
    <TimelineComponent/>
    <Tuto path="/lottie/UI/scroll.json" listener="scroll"/>
  </div>
</template>

<script>
import TimelineComponent from '@/components/ui/TimelineComponent'
import Tuto from '@/components/ui/Tuto'

export default {
  name: 'OutsideOne',
  components: {
    TimelineComponent,
    Tuto
  }
}
</script>

<style scoped lang="scss">

</style>