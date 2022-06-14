<template>
  <div class="button" :class="{
    'center': isHomePage,
    'right': !isHomePage
  }">
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
  z-index: 50;
  background: #1A1A1A40;
  border: 2px solid $white;
  border-radius: 8px;
  transition: 0.5s;
  display: inline-block;
  animation: 1.2s ease-in infinite alternate heartMove;

  a {
    font-size: 24px;
    display: block;
    padding: 8px 24px;
    font-weight: 500;
    font-family: 'RoadRage', sans-serif;
    color: $white;
  }

  &:hover {
    -webkit-animation-play-state: paused;
    background: $white !important;
    a {
      color: $blueGreen;
    }
  }

  @keyframes heartMove {
    from {
      border-color: transparent;
      background: transparent;
    }
    to {
      border-color: $white;
      background: #1A1A1A40;
    }
  }
}

.right {
  position: fixed;
  right: 104px;
  bottom: 40px;
}

.center {
  position: fixed;
  bottom: 15vh;
  right: 50%;
  transform: translateX(50%);
}
</style>