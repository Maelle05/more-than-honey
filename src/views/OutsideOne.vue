<template>
  <div class="outsideOne u-cursor-hidden">
    <TimelineComponent/>
    <Tuto path="/lottie/UI/scroll.json" listener="scrollToTop"/>
    <CursorNext to="/pollenGame" ref="cursorNext"/>
  </div>
</template>

<script>
import TimelineComponent from '@/components/ui/TimelineComponent'
import Tuto from '@/components/ui/Tuto'
import CursorNext from '@/components/ui/CursorNext'
import OutsideOne from '@/webgl/scenes/OutsideOneScene'

export default {
  name: 'OutsideOne',
  components: {
    TimelineComponent,
    Tuto,
    CursorNext
  },
  mounted(){
    // Pass Cursor to scene
    this.scene = new OutsideOne()
    this.scene.initCursorComponent(this.$refs.cursorNext)
  }
}
</script>

<style scoped lang="scss">
.outsideOne {
  width: 100vw;
  height: 100vh;
}
</style>