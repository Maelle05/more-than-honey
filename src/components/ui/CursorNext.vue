<template>
  <div class="cursorNext">
    <div class="customCursor" ref="cursor"/>
    <div class="customCursorBorder" ref="cursorBorder"/>
    <div class="customCursorBorder" ref="cursorBorder2"/>
  </div>
</template>

<script lang="js">

export default {
  name: 'CursorNext',
  props: {
    to: {
      required: true,
      default: '/'
    }
  },
  mounted(){
    const cursor = this.$refs.cursor
    const cursorBorder = this.$refs.cursorBorder
    const cursorBorder2 = this.$refs.cursorBorder2

    this.canGoNext = false

    document.addEventListener('mousemove', (e) => {
      let mouseX = e.clientX
      let mouseY = e.clientY
      cursor.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`
      cursorBorder.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`
      cursorBorder2.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`
    })
  },
  methods: {
    endScene(){
      console.log('end of the scene')
      this.$refs.cursorBorder.classList.add('customCursorEnding')
      this.$refs.cursorBorder2.classList.add('customCursorEnding2')
      this.$refs.cursor.classList.add('customCursorEnd')
      this.canGoNext = true

      document.addEventListener('click', this.changeScene.bind(this), true)
    },
    changeScene(){
      if (this.canGoNext) {
        this.canGoNext = false
        this.$router.push(this.to)
      }
    }
  },
}
</script>

<style scoped lang="scss">
.cursorNext {
  cursor: none !important;
  .customCursor {
    cursor: none !important;
    height: 5px;
    width: 5px;
    background: $white;
    border-radius: 50%;
    position: fixed;
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: width .7s, height .7s, opacity .7s;

    &::after {
      content: 'Continuer';
      color: $black;
      font-family: 'Lato';
      font-size: 0px;
      transition: all .7s;
    }

    &Border {
      width: 10px;
      height: 10px;
      border-radius: 100%;
      border: 2px solid transparent;
      position: fixed;
      transition: border .7s, width .7s, height .7s;
      pointer-events: none;
      left: 0;
      top: 0;
      transform: translate(calc(-50% + 15px), -50%);
      cursor: none !important;
    }

    &End {
      height: 70px;
      width: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      &::after {
        content: 'Continuer';
        color: $black;
        font-family: 'Lato';
        font-size: 12px;
      }
    }

    &Ending {
      height: 75px;
      width: 75px;
      border: 1.5px solid $white !important;
    }

    &Ending2 {
      height: 80px;
      width: 80px;
      border: 1px solid $white !important;
    }
  }
}
</style>