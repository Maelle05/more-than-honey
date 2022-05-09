<template>
  <div class="ending">
    <Button label="Recommencer" to="/"/>
    <TimelineComponent/>
  </div>
</template>

<script lang="js">
import Button from '@/components/ui/PrimaryButton'
import TimelineComponent from '@/components/ui/TimelineComponent'

export default {
  name: 'Home',
  components: {
    TimelineComponent,
    Button
  }
}
</script>

<style scoped lang="scss">

</style>