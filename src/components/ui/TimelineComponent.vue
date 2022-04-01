<template>
  <ul class="timeline">
    <router-link class="timeline__item" v-for="route in routes" :key="route.label" :to="route.path">{{route.label}}</router-link>
  </ul>
</template>

<script lang="js">
import {routes} from '@/router'

export default {
  name: 'TimelineComponent',
  data() {
    return {
      routes: routes
    }
  }
}

</script>

<style scoped lang="scss">
.timeline {
  margin: 20px auto;
  display: flex;
  justify-content: center;
  &__item {
    color: powderblue;
    margin-right: 10px;
    font-size: 20px;
  }
}
</style>