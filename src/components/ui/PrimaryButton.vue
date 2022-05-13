<template>
  <div class="button" :class="{'center': isHomePage}">
    <router-link :to=to>{{label}}</router-link>
  </div>
</template>

<script lang="js">
export default {
  name: 'PrimaryButton',
  props: {
    to: {
      required: true,
      default: '/'
    },
    label: {
      required: true,
      default: ''
    },
    isHomePage: {
      required: false,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.button {
  a {
    color: $blueGreen;
    text-transform: uppercase;
    font-size: 16px;
    display: block;
    padding: 15px 24px;
    font-weight: 600;
    font-family: 'RoadRage', sans-serif;
  }
  &:hover {
    //background: $hoverGrey;
  }
}

.center {
  position: fixed;
  background: $white;
  border-radius: 8px;
  transition: 0.5s;
  font-size: 16px;
  bottom: 11vh;
  right: 50%;
  transform: translateX(50%);
}
</style>