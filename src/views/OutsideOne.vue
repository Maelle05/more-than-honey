<template>
  <div class="outsideOne">
    <CursorNext to="/pollenGame"/>
    <TimelineComponent/>
    <Tuto path="/lottie/UI/scroll.json" listener="scrollToTop"/>
  </div>
</template>

<script>
import TimelineComponent from '@/components/ui/TimelineComponent'
import Tuto from '@/components/ui/Tuto'
import CursorNext from '@/components/ui/CursorNext'

export default {
  name: 'OutsideOne',
  components: {
    TimelineComponent,
    Tuto,
    CursorNext
  }
}
</script>

<style scoped lang="scss">
.outsideOne{
  cursor: none;
}

</style>