<template>
  <div class="popup">
    <h1 v-if="title !== ''" class="popup__title">{{ title }}</h1>
    <slot/>
    <button class="popup__button" @click="actionOnClick">
      {{ labelButton }}
    </button>
    <PrimaryButton v-if="path !== ''" label="Passer à la suite" :to="path"/>
  </div>
</template>

<script>
import PrimaryButton from '@/components/ui/PrimaryButton'

export default {
  name: 'Popup',
  components: {PrimaryButton},
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
  color: $black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 300px;
  padding: 24px 64px;

  &__title {
    font-size: 24px;
    font-weight: normal;
    margin-bottom: 20px;
    font-family: 'RoadRage', sans-serif;
    color: $black;
  }

  &__button {
    all: unset;
    display: block;
    font-family: 'RoadRage', sans-serif;
    text-transform: uppercase;
    font-size: 16px;
    color: $white;
    background-color: #003B48;
    border-radius: 4px;
    padding: 11px 16px;
    margin-top: 20px;
    cursor: pointer;
  }
}
</style>