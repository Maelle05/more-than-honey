<template>
  <div class="cursorNext" v-if="this.$route.path !== '/'">
    <div class="customCursor" ref="cursor"/>
    <div class="customCursorBorder" ref="cursorBorder"/>
  </div>
</template>

<script lang="js">
export default {
  name: 'CursorNext',
  mounted(){
    const cursor = this.$refs.cursor
    const cursorBorder = this.$refs.cursorBorder

    document.addEventListener('mousemove', (e) => {
      let mouseX = e.clientX
      let mouseY = e.clientY
      cursor.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`
      cursorBorder.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`
    })


    // Send to webgl
  }
}
</script>

<style scoped lang="scss">
.cursorNext {
  cursor: none;
  .customCursor {
    cursor: none;
    height: 20px;
    width: 20px;
    background: white;
    border-radius: 50%;
    position: fixed;
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: width .3s, height .3s, opacity .3s;

    &Border {
      width: 50px;
      height: 50px;
      border-radius: 100%;
      border: 2px solid transparent;
      transition: all 200ms ease-out;
      position: fixed;
      pointer-events: none;
      left: 0;
      top: 0;
      transform: translate(calc(-50% + 15px), -50%);
    }

    &Ending {
      border: 2px solid white !important;
    }
  }
}
</style>