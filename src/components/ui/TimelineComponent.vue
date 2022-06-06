<template>
  <div class="timeline">
    <div class="timeline__bg"></div>
    <div class="timeline__sound">
      <img src="/images/timeline/sound.svg" alt="icon to cut or add sound to the experience">
    </div>

    <ul class="timeline__wrapper">
      <router-link class="timeline__item" v-for="path in paths" :key="path.label" :to="path.path" ref="bullets">
        <div class="cursor">
          <div class="cursor__ball"/>
        </div>
        <img class="iconImg" :src="path.iconPath" alt="icon of the timeline">
        <div class="line"/>
      </router-link>
    </ul>
  </div>

</template>

<script lang="js">
import TimelineContent from '../../../public/data/timelineContent.json'
import WebGl from '@/webgl/webglManager'

export default {
  name: 'TimelineComponent',
  data() {
    return {
      paths: TimelineContent
    }
  }
}

</script>

<style scoped lang="scss">
.active {
  .cursor {
    display: block !important;
  }
}

.timeline {
  width: 64px;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;

  display: flex;
  flex-direction: column;
  justify-content: end;

  &__bg {
    position: absolute;
    right: 0;
    top: 0;
    width: 64px;
    height: 100vh;
    background: rgba(26, 26, 26, 0.5);
    filter: blur(16px);
  }

  &__sound {
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
    cursor: pointer;
  }

  &__wrapper {
    margin-bottom: 20px;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;

    &:last-child {
      .line {
        height: 0;
      }
    }

    .line {
      width: 2px;
      background: $white;
      height: calc(63vh / 6);
      margin: 10px 0;
    }

    .cursor {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      border: 2px solid $white;
      position: absolute;
      top: 16px;
      transform: translateY(-25%);
      display: none;

      &__ball {
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>