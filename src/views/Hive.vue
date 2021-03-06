<template>
  <div class="hive">
    <div class="customCursor" ref="cursor"/> 
    <div class="customCursorBorder" ref="cursorBorder"/>
    <TimelineComponent ref="timeline"/>
    <div ref="nextButton" class="u-hidden hive_button">
      <router-link to="/outsideOne">Passer à la suite</router-link>
    </div>
    <Tuto path="/lottie/UI/hover.json" listener="mouseMove"/>
    <div class="subtitles--wrapper"></div>

    <div class="hive__point" v-for="(bee, i) in bees" :key="i" ref="points">
      <div class="pointer"/>
      <div class="text" :class="bee.style">
        <img class="img" :src="bee.imgPath" alt="">
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
import JsonBeesContent from '../../public/data/hiveContent.json'
import Tuto from '@/components/ui/Tuto'
import Listener from '@/webgl/utils/Listener'

export default {
  name: 'Hive',
  components: {
    TimelineComponent,
    Tuto
  },
  data() {
    return {
      bees: JsonBeesContent
    }
  },
  mounted() {
    const cursor = this.$refs.cursor
    const cursorBorder = this.$refs.cursorBorder

    // Send to webgl
    const scene = new HiveScene()
    this.listener = new Listener()

    scene.setUpPointsFromDOM(this.$refs.points)
    scene.setUpCursor(cursorBorder)
    scene.setNextButton(this.$refs.nextButton)
    scene.getActiveTimelineItem(this.$refs.timeline.$el)

    document.addEventListener('mousemove', (e) => {
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

  &_button {
    z-index: 50;
    background: #1A1A1A40;
    border: 2px solid $white;
    border-radius: 8px;
    transition: 0.5s;
    display: inline-block;
    animation: ease-in 1.2s 3 alternate heartMove;
    position: fixed;
    right: 104px;
    bottom: 40px;

    a {
      font-size: 24px;
      display: block;
      padding: 8px 24px;
      font-weight: 500;
      font-family: 'RoadRage', sans-serif;
      color: $white;
    }

    &:hover {
      -webkit-animation-play-state: paused;
      background: $white !important;
      a {
        color: $blueGreen;
      }
    }

    @keyframes heartMove {
      from {
        border-color: transparent;
        background: transparent;
      }
      to {
        border-color: $white;
        background: #1A1A1A40;
      }
    }
  }

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
      padding: 30px;
      text-align: center;
      border-radius: 16px;
      z-index: 15;

      transform: scale(0, 0);
      transition: transform 0.3s;

      .img {
        width: 70px;
      }

      .name {
        font-size: 16px;
        color: $blueGreen;
        padding-bottom: 3px;
      }

      .content {
        font-size: 14px;
      }

      .label {
        font-size: 16px;
        color: $black;
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
