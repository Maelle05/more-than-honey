<template>
  <div class="button" v-if="this.$route.path !== '/'">
    <router-link to="/">
      <img class="logo" src="@/assets/images/logo.svg" alt="white logo of the project 'more than honey'">
    </router-link>
  </div>
</template>

<script lang="js">
export default {
  name: 'HomeButton'
}
</script>

<style scoped lang="scss">
.button {
  position: fixed;
  top: 32px;
  left: 32px;
  img {
    height: 56px;
  }
}
</style>