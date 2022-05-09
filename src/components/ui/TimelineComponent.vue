<template>
  <div class="timeline">
    <div class="timeline__bg"></div>
    <div class="timeline__sound">
      <img src="/images/timeline/sound.svg" alt="icon to cut or add sound to the experience">
    </div>
    <div class="timeline__subtitle">
      <img src="/images/timeline/subtitles.svg" alt="icon to remove or add subtitle to the experience">
    </div>
    <ul class="timeline__wrapper">
      <router-link class="timeline__item" v-for="path in paths" :key="path.label" :to="path.path">
        <p class="label" :class="{label__longue: path.label === 'Pollenisation'}">{{path.label}}</p>
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
  .cursor, .label {
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

  &__sound, &__subtitle {
    display: flex;
    justify-content: center;
    padding-bottom: 3vh;
    cursor: pointer;
  }

  &__wrapper {
    margin-bottom: 3vh;
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
      height: calc(60vh / 6);
      margin: 10px 0;
    }

    .label {
      display: none;
      position: absolute;
      color: white;
      margin-right: 150px;
      top: -4px;

      &__longue {
        margin-right: 200px;
      }
    }

    .cursor {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      border: 2px solid $white;
      position: absolute;
      top: 50%;
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