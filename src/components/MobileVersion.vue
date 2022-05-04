<template>
  <div class="mobileVersion">
    <img class="logo" src="@/assets/images/logo.svg" alt="white logo of the project 'more than honey'">
    <p>Désolé, cette expérience n'est disponible que depuis un ordinateur :)</p>
  </div>
</template>

<script>
export default {
  name: 'MobileVersion'
}
</script>

<style scoped lang="scss">
.mobileVersion {
  background: $black;
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 10%;
  text-align: center;
  height: 100vh;

  .logo {
    height: 100px;
    margin-bottom: 50px;
  }

}
</style>
