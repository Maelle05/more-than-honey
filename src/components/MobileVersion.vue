<template>
  <div class="mobileVersion">
    <img class="logo" src="@/assets/images/computer.png" alt="white computer">
    <p>Veuillez nous excusez <br/><b>More than honey</b> n'est disponible que<br/> depuis un ordinateur</p>
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
  text-align: center;
  height: 100vh;
  width: 100vw;
  font-size: 20px;

  .logo {
    height: 120px;
    margin-bottom: 24px;
  }

}
</style>
