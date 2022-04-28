<template>
  <div class="hive">
    <Button label="Suivant" to="/outsideOne"/>
    <TimelineComponent/>
    <div class="hive__point" v-for="(bee, i) in bees" :key="i" ref="points">
      <div class="pointer"/>
      <div class="text">
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
    const scene = new HiveScene()
    scene.setUpPointsFromDOM(this.$refs.points)
  }
}

</script>

<style lang="scss">
.hive {
  width: 100vw;
  height: 100vh;

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
      top: 20px;
      left: -60px;
      box-shadow: 0 0 23px 5px $white;
      z-index: 0;

      transform: scale(1, 1);
      transition: transform 0.3s;
    }

    .text {
      pointer-events: none;
      position: absolute;
      top: 30px;
      left: -160px;
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
