<template>
  <div class="popup">
    <h1 v-if="title !== ''" class="popup__title">{{ title }}</h1>
    <slot class="popup__content"/>
    <button class="popup__button" @click="actionOnClick">
      {{ labelButton }}
    </button>
    <button v-if="path !== ''" class="popup__nextButton">
      <router-link class="u-uppercase" :to="path">Passer à la suite</router-link>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    title: {
      required: false,
      default: ''
    },
    labelButton: {
      required: true,
      default: ''
    },
    path: {
      required: false,
      default: ''
    }
  },
  methods: {
    actionOnClick() {
      this.$emit('action-on-click')
    }
  }
}

</script>

<style lang="scss" scoped>
.popup {
  background: $white;
  border-radius: 16px;
  font-size: 14px;
  color: $black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 320px;
  padding: 24px 40px;

  &__title {
    font-size: 24px;
    font-weight: normal;
    margin-bottom: 8px;
    font-family: 'RoadRage', sans-serif;
    color: $black;
  }

  &__content {
    font-size: 14px;
  }

  &__nextButton {
    a {
      color: $blueGreen;
      font-size: 20px;
    }
    all: unset;
    padding: 8px 24px;
    font-family: 'RoadRage', sans-serif;
  }

  &__button {
    all: unset;
    display: block;
    font-family: 'RoadRage', sans-serif;
    text-transform: uppercase;
    font-size: 20px;
    color: $blueGreen;
    border: 2px solid $blueGreen;
    background: transparent;
    border-radius: 4px;
    padding: 4px 20px;
    margin-top: 32px;
    cursor: pointer;
    z-index: 10; // to fix lottie issue
    transition: 0.3s;

    &:hover {
      background: $blueGreen;
      color: $white;
    }
  }
}
</style>