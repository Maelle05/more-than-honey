<template>
  <div class="home">
    <h1>This is the home page</h1>

    <BaseComponent msg="This is a component"/>
  </div>
</template>

<script>
// @ is an alias to /src
import BaseComponent from '@/components/BaseComponent'

export default {
  name: 'Home',
  components: {
    BaseComponent
  }
}
</script>
