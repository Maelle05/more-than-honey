<template>
  <div class="cursorNext">
    <div class="customCursor" ref="cursor"/>
    <div class="customCursorBorder" ref="cursorBorder"/>
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

    this.canGoNext = false

    document.addEventListener('mousemove', (e) => {
      let mouseX = e.clientX
      let mouseY = e.clientY
      cursor.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`
      cursorBorder.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`
    })
  },
  methods: {
    endScene(){
      console.log('end')
      this.$refs.cursor.classList.add('customCursorEnd')
      this.$refs.cursorBorder.classList.add('customCursorBorderEnd')
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
  //cursor: none !important;
  .customCursor {
    height: 6px;
    width: 6px;
    background: $white;
    border-radius: 50%;
    position: fixed;
    transform: translate(-50%, -50%);
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: width .7s, height .7s, opacity .7s;
    box-shadow: 0 0 2px 1px $white;

    &::after {
      opacity: 0;
      font-size: 0;
      content: 'Continuer';
      color: $blueGreen;
      font-family: 'RoadRage', sans-serif;
      transition: all .7s;
    }

    &End {
      height: 80px;
      width: 80px;
      box-shadow: 0 0 1px 5px $white;
      animation: 1.2s ease-in infinite alternate heartMove2;


      &::after {
        font-size: 24px;
        opacity: 1;
      }
    }

    &Border {
      height: 0;
      width: 0;
      border-radius: 50%;
      border: 2px solid $white !important;
      box-shadow: 0 0 0.5px 0.5px $white;
      transition: width .7s, height .7s;

      &End {
        animation: 1.2s ease-in infinite alternate heartMove;
        height: 96px;
        width: 96px;
      }
    }


    @keyframes heartMove {
      from { 
        opacity: 0;
        height: 94px;
        width: 94px;
      }
      to { 
        opacity: 1;
        height: 102px;
        width: 102px;
      }
    }
  }
}
</style>