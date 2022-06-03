<template>
  <div class="raceGame" ref="raceGameUI">
    <TimelineComponent ref="timeline"/>
    <Starter ref="starter"/>

    <div class="raceGame__loose u-hidden" ref="lottieLoose">
      <lottie-player loop autoplay background="transparent" mode="normal" src="/lottie/raceGame/Heart.json"
                     style="width: 200px"></lottie-player>
    </div>

    <div class="raceGame__lifeBar u-hidden" ref="lifeBar">
       <span class="heart" v-for="i in numberOfLife" :key="i">
         <img src="/images/raceGame/heart.svg" alt="heart icon">
       </span>
      <p></p>
    </div>

    <Popup class="popupRace" ref="popupIntro" title="Course poursuite" label-button="Commencer à jouer"
           @action-on-click="startGame">
      <p>Votre but est de <strong> fuir le plus rapidement possible </strong> pour vous protéger du <strong>frelon
        asiatique</strong>.</p>
      <lottie-player autoplay background="transparent" loop mode="normal" src="/lottie/game/DeplacementPop.json"
                     style="width: 90px"></lottie-player>
      <p>Faites de votre mieux pour <strong>contrôler le mouvement et esquiver les rejets de pesticides</strong>.</p>
      <img class="popupRace__element" src="/images/popup/portal.png" alt="cloud of pesticide">
      <p><strong>Atteignez la ruche </strong>avant que le frelon ne vous <strong>rattrape</strong> !</p>
    </Popup>

    <Popup class="popupRace u-hidden" ref="popupOutro" label-button="Envie de rejouer ?" path="/ending"
           @action-on-click="reStart">
      <h2 class="popupRace__title u-uppercase">Bravo</h2>
      <p>Vous avez réussi à finir la course sans que le frelon vous rattrape</p>
      <img class="popupRace__element" src="/images/popup/plume.svg" alt="plume">
      <h2 class="popupRace__title">Le saviez-vous ?</h2>
      <p>Importé involontairement en 2004, le frelon asiatique est aujourd’hui capable de décimer des colonies en un
        temps record.</p>
    </Popup>

    <Popup class="popupRace u-hidden" ref="popupOutroLoose" label-button="Envie de rejouer ?" path="/ending"
           @action-on-click="reStart">
      <h2 class="popupRace__title u-uppercase">Dommage...</h2>
      <p>Vous <strong>n'avez pas pu échapper aux pesticides</strong></p>
      <img class="popupRace__element" src="/images/popup/heart.svg" alt="icon of a heart broken">
      <h2 class="popupRace__title">Le saviez-vous ?</h2>
      <p>D'après une étude britannique, depuis 1994 le taux de mortalité des abeilles sauvages aurait été multiplié par
        trois à cause des pesticides.</p>
    </Popup>
  </div>
</template>

<script lang="js">
import TimelineComponent from '@/components/ui/TimelineComponent'
import Popup from '@/components/ui/Popup'
import '@lottiefiles/lottie-player'
import RaceGameScene from '@/webgl/scenes/RaceGameScene'
import Starter from '@/components/ui/Starter'
import JsonBeesContent from '../../public/data/hiveContent.json'

export default {
  name: 'RaceGame',
  components: {
    TimelineComponent,
    Popup,
    Starter
  },
  mounted() {
    this.webGLInstance = new RaceGameScene()
    this.webGLInstance.setupDomElements(this.$refs.popupIntro.$el, this.$refs.popupOutro.$el, this.$refs.lottieLoose, this.$refs.raceGameUI, this.$refs.lifeBar)
    this.webGLInstance.getActiveTimelineItem(this.$refs.timeline.$el)
  },
  data() {
    return {
      numberOfLife: 0 // init at 0 and update on when the game is started
    }

  },
  methods: {
    startGame() {
      if (this.$refs.popupIntro) {
        this.$refs.popupIntro.$el.classList.add('u-hidden')
        this.$refs.raceGameUI.classList.add('u-cursor-hidden')
        this.numberOfLife = this.webGLInstance.property.game.numberOfLife

        Starter.methods.startLottieAnimation()
        setTimeout(() => this.webGLInstance.playGame(), 3500)
      }
    },
    reStart() {
      if (this.$refs.popupOutro) {
        this.$refs.popupOutro.$el.classList.add('u-hidden')
        this.$refs.raceGameUI.classList.add('u-cursor-hidden')

        Starter.methods.startLottieAnimation()
        setTimeout(() => this.webGLInstance.reStartGame(), 3500)
      }
    }
  },
}
</script>

<style scoped lang="scss">
.raceGame {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &__lifeBar {
    position: absolute;
    top: 50px;
    right: 130px;

    .heart {
      margin: 0 5px;
    }
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