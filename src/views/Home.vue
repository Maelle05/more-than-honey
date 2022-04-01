<template>
  <div class="home">
    <h1>This is the home page</h1>

    <Button to="/honeyIntro" label="Start the experiment"/>
  </div>
</template>

<script>
import Button from '@/components/ui/Button'

export default {
  name: 'Home',
  components: {
    Button
  }
}
</script>
