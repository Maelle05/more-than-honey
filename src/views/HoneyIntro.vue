<template>
  <div class="honeyIntro">
    <h1>Honey Home Intro</h1>
    <Button to="/hive" label="Next"/>

  </div>
</template>

<script>
// @ is an alias to /src
import Button from '@/components/ui/Button'

export default {
  name: 'HoneyIntro',
  components: {
    Button
  }
}
</script>

<style scoped lang="scss">

</style>