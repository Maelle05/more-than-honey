<template>
  <div class="outsideTwo u-cursor-hidden">
    <TimelineComponent/>
    <Tuto path="/lottie/UI/scroll.json" listener="scrollToTop"/>
    <CursorNext to="/raceGame" ref="cursorNext"/>
  </div>
</template>

<script>
import TimelineComponent from '@/components/ui/TimelineComponent'
import Tuto from '@/components/ui/Tuto'
import CursorNext from '@/components/ui/CursorNext'
import OutsideTwo from '@/webgl/scenes/OutsideTwoScene'

export default {
  name: 'OutsideTwo',
  components: {
    TimelineComponent,
    Tuto,
    CursorNext
  },
  mounted(){
    // Pass Cursor to scene
    this.scene = new OutsideTwo()
    this.scene.initCursorComponent(this.$refs.cursorNext)
  }
}
</script>

<style scoped lang="scss">
.outsideTwo {
  width: 100vw;
  height: 100vh;
}
</style>