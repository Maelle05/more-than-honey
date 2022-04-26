<template>
  <div class="home">
    <h1>This is the home page</h1>

    <Button to="/honeyIntro" label="Commencer l'expérience"/>
  </div>
</template>

<script>
import Button from '@/components/ui/Button'
import WebGl from '@/webgl/webglManager'

export default {
  name: 'Home',
  components: {
    Button
  },
  mounted() {
    const manager =  new WebGl()
    setTimeout(() => {
      manager.loader.classList.add('loaded')
      localStorage.setItem('isHomePassed', true)
    }, 500)
    
  }
}
</script>
