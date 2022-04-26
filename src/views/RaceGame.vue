<template>
  <div class="raceGame">
    <h1>Race Game</h1>
    <Button label="Suivant" to="/ending"/>
  </div>
</template>

<script lang="js">
import Button from '@/components/ui/Button'

export default {
  name: 'RaceGame',
  components: {
    Button
  }
}
</script>

<style scoped lang="scss">

</style>