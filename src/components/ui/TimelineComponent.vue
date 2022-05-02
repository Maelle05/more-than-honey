<template>
  <div class="timeline">
    <ul class="timelinee">
      <router-link class="timelinee__item" v-for="route in routes" :key="route.label" :to="route.path">{{route.label}}</router-link>
    </ul>
    <ul class="timeline__wrapper">
      <router-link class="timeline__item" v-for="path in paths" :key="path.label" :to="path.path">
<!--        {{route.label}}-->
        <img class="iconImg" v-if="path.iconPath !== ''" :src="path.iconPath" alt="icon of the timeline">
        <div v-if="path.iconPath === ''"  class="icon"/>
        <div class="line"/>
      </router-link>
    </ul>
  </div>

</template>

<script lang="js">
import {routes} from '@/router'
import TimelineContent from '../../../public/data/timelineContent.json'

export default {
  name: 'TimelineComponent',
  data() {
    return {
      routes: routes,
      paths: TimelineContent
    }
  }
}

</script>

<style scoped lang="scss">
.timeline {
  width: 64px;
  height: 100vh;
  background: #00000090;
  position: fixed;
  right: 0;
  top: 0;

  display: flex;
  flex-direction: column;
  justify-content: end;

  &__wrapper {
    margin-bottom: 64px;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &:last-child {
      .line {
        height: 0;
      }
    }

    .icon {
      background: white;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      box-shadow: 0 0 23px 3px $white;
    }

    .line {
      width: 2px;
      background: $white;
      height: calc(60vh / 6);
      margin: 10px 0;
    }
  }
}

.timelinee {
  margin: 20px auto;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 10px;
  right: 100px;
  &__item {
    color: powderblue;
    margin-right: 10px;
    font-size: 20px;
  }
}
</style>