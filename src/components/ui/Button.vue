<template>
  <div>
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

</style>