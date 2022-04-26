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
  bottom: 65px;
  right: 112px;
  background: $white;
  border-radius: 8px;
  transition: 0.5s;

  &:hover {
    background: $hoverGrey;
  }

  a {
    color: black;
    display: block;
    padding: 15px 24px;
    font-weight: 600;
  }
}
</style>