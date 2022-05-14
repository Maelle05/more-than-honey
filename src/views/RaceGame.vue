<template>
  <div class="raceGame">
    <TimelineComponent/>
    <Starter ref="starter"/>
    <Popup class="popupRace hidden" ref="popupIntro" title="Course poursuite" label-button="Commencer à jouer"
           @action-on-click="startGame">
      <p>Votre but est de <strong> fuir le plus rapidement possible </strong> pour vous protéger du <strong>frelon
        asiatique</strong>.</p>
      <lottie-player autoplay background="transparent" loop mode="normal" src="/lottie/game/DeplacementPop.json"
                     style="width: 90px"></lottie-player>
      <p>Faites de votre mieux pour <strong>contrôler le mouvement et esquiver les rejets de pesticides</strong>.</p>
      <img class="popupRace__element" src="/images/popup/portal.svg" alt="blue portal">
      <p><strong>Atteignez la ruche </strong>avant que le frelon ne vous <strong>rattrape</strong> !</p>
    </Popup>

    <Popup class="popupRace hidden" ref="popupOutro" label-button="Envie de rejouer ?" path="/ending"
           @action-on-click="reStart">
      <h2 class="popupRace__title u-uppercase">Bravo</h2>
      <p>Vous avez réussi à finir la course sans que le frelon vous rattrape</p>
      <img class="popupRace__element" src="/images/popup/plume.svg" alt="plume">
      <h2 class="popupRace__title">Le saviez-vous ?</h2>
      <p>Cela fait environ 30 ans que les populations d’abeilles diminuent en France. <br>Importé involontairement en
        2004,
        le frelon asiatique est aujourd’hui capable de décimer des colonies en un temps record.</p>
    </Popup>
  </div>
</template>

<script lang="js">
import TimelineComponent from '@/components/ui/TimelineComponent'
import Popup from '@/components/ui/Popup'
import '@lottiefiles/lottie-player'
import RaceGameScene from '@/webgl/scenes/RaceGameScene'
import Starter from '@/components/ui/Starter'

export default {
  name: 'RaceGame',
  components: {
    TimelineComponent,
    Popup,
    Starter
  },
  mounted() {
    const scene = new RaceGameScene()
    scene.setupPopups(this.$refs.popupIntro.$el, this.$refs.popupOutro.$el)

    // 🐝  En attendant
    setTimeout(()=>{
      Starter.methods.startLottieAnimation()
    }, 1000)
    
  },
  methods: {
    startGame() {
      if (this.$refs.popupIntro) {
        this.$refs.popupIntro.$el.classList.add('hidden')

        // 🐝 Il faudrat que tu utilises ca :)🐝
        // Starter.methods.startLottieAnimation()



        // this.$refs.starter.$el.classList.remove('hidden')
        // setTimeout(() => {
        //     this.$refs.starter.$el.classList.add('hidden')
        // }, 3100)
      }
      console.log('start game !')
    },
    reStart() {
      console.log('rejouer !')
    }
  }
}
</script>

<style scoped lang="scss">
.raceGame {
  //cursor: none;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;

  .hidden {
    opacity: 0;
    display: none;
  }

  .popupRace {
    font-size: 12px;

    &__title {
      font-size: 24px;
      font-family: 'RoadRage', sans-serif;
      margin-bottom: 8px;
      font-weight: 500;
    }

    &__element {
      margin: 25px 15px;
    }
  }
}
</style>