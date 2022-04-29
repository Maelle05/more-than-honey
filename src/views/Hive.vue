<template>
  <div class="hive">
    <Button label="Suivant" to="/outsideOne"/>
    <div class="customCursor" ref="cursor"/>
    <div class="customCursorBorder" ref="cursorBorder"/>
    <TimelineComponent/>
    <div class="hive__point" v-for="(bee, i) in bees" :key="i" ref="points">
      <div class="pointer"/>
      <div class="visitedPointer">
        <img :src="bee.imgPath" class="icon" alt="icon of the bee depend on his task">
        {{bee.name}}
      </div>
      <div class="text" :class="bee.style">
        <div class="close"/>
        <img :src="bee.imgPath" alt="">
        <h3 class="name">{{bee.name}}</h3>
        <p class="label">{{bee.label}}</p>
        <p class="content">{{bee.content}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import HiveScene from '@/webgl/scenes/HiveScene'
import TimelineComponent from '@/components/ui/TimelineComponent'
import Button from '@/components/ui/PrimaryButton'
import JsonBeesContent from '../../public/data/hiveContent.json'

export default {
  name: 'Hive',
  components: {
    TimelineComponent,
    Button
  },
  data() {
    return {
      bees: JsonBeesContent
    }
  },
  mounted() {
    const cursor = this.$refs.cursor
    const cursorBorder = this.$refs.cursorBorder

    // send to webgl
    const scene = new HiveScene()
    scene.setUpPointsFromDOM(this.$refs.points)
    scene.setUpCursor(cursorBorder)

    document.addEventListener('mousemove', function(e){
      let mouseX = e.clientX
      let mouseY = e.clientY
      cursor.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`
      cursorBorder.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`
    })
  }
}

</script>

<style lang="scss">
.customCursor {
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

  &Hover {
    border: 2px solid white !important;
  }
}

.hive {
  width: 100vw;
  height: 100vh;
  cursor: none; // custom cursor

  &__point {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
    color: $white;
    text-align: center;

    .pointer {
      cursor: pointer;
      height: 32px;
      width: 32px;
      background: $white;
      border-radius: 50%;
      position: absolute;
      box-shadow: 0 0 23px 5px $white;
      z-index: 0;
      display: none;

      transform: scale(1, 1);
      transition: transform 0.3s;
    }

    .visitedPointer {
      background: $white;
      color: $black;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px 13px;
      border-radius: 16px;
      display: none;

      .icon {
        padding-right: 16px;
      }
    }

    .point0 {
      bottom: 60px;
      right: -160px;
    }

    .point1 {
      bottom: 60px;
      right: -160px;
    }

    .point2 {
      top: 60px;
      right: -160px;
    }

    .point3 {
      top: 60px;
      right: -160px;
    }

    .point4 {
      top: 60px;
      right: -160px;
    }

    .point5 {
      top: 60px;
      right: -160px;
    }

    .point6 {
      bottom: 60px;
      right: -160px;
    }

    .text {
      pointer-events: none;
      position: absolute;
      width: 300px;
      color: $black;
      background-color: $white;
      line-height: 1.3em;
      font-weight: 100;
      padding: 16px 16px 30px 16px;
      text-align: center;
      border-radius: 16px;
      z-index: 15;

      transform: scale(0, 0);
      transition: transform 0.3s;

      .close {
        position: absolute;
        right: 24px;
        top: 24px;
        width: 16px;
        height: 3px;
        border-radius: 2px;
        background: $blueGreen;
      }

      .name {
        font-size: 16px;
        padding-bottom: 3px;
      }

      .content {
        font-size: 12px;
      }

      .label {
        font-size: 12px;
        color: $blueGreen;
        padding-bottom: 20px;
      }
    }
  }

  .visible {
    .text {
      transform: scale(1, 1);
      transition: transform 0.3s;
    }
  }
}
</style>
