<template>
  <div class="timeline">
    <ul class="timelinee">
      <router-link class="timelinee__item" v-for="route in routes" :key="route.label" :to="route.path">{{route.label}}</router-link>
    </ul>
    <ul class="timeline__wrapper">
      <router-link class="timeline__item" v-for="path in paths" :key="path.label" :to="path.path">
<!--        {{route.label}}-->
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
.active {
  .cursor {
    display: block !important;
  }
}

.timeline {
  width: 64px;
  height: 100vh;
  background: #00000080;
  box-shadow: -10px 0px 15px 0px rgba(0,0,0,0.59);
  position: fixed;
  right: 0;
  top: 0;

  display: flex;
  flex-direction: column;
  justify-content: end;

  &__wrapper {
    margin-bottom: 50px;
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

    .cursor {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      border: 2px solid $white;
      position: absolute;
      top: 50%;
      transform: translateY(-15%);
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