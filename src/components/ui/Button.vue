<template>
  <div class="button">
    <router-link :to=to>{{label}}</router-link>
  </div>
</template>

<script lang="js">
export default {
  name: 'Button',
  props: {
    to: {
      required: true,
      default: '/'
    },
    label: {
      required: true,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.button {
  position: fixed;
  bottom: 50px;
  right: 50px;

  a {
    color: $white;
    border: 2px solid $white;
    border-radius: 10px;
    padding: 10px 20px;
  }
}
</style>