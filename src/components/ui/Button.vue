<template>
  <div class="button" :class="{'center': isHomePage}">
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
  position: fixed;
  bottom: 65px;
  right: 112px;
  background: $white;
  border-radius: 8px;
  transition: 0.5s;
  font-size: 16px;

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

.center {
  bottom: 11vh;
  right: 50%;
  transform: translateX(50%);
}
</style>