<template>
  <div class="pollenGame" ref="pollenGameUI">
    <TimelineComponent/>
    <Popup class="popupPollen hidden" ref="popUpIntro" title="Le jeu du pollen" label-button="Commencer à jouer"
           @action-on-click="startGame">
      <p>L’objectif est de <strong> polliniser </strong> un maximum de fleurs dans le temps imparti.</p>
      <lottie-player autoplay background="transparent" loop mode="normal" src="/lottie/game/DeplacementPop.json"
                     style="width: 90px"></lottie-player>
      <p><strong>Déplacez-vous</strong> vers les fleurs grâce à votre <b>souris</b></p>
      <p class="popupPollen__element u-uppercase espace">Espace</p>
      <p><strong> Appuyez sur espace </strong> pour polliniser cette fleur</p>
      <p class="popupPollen__element attention u-uppercase">Attention !</p>
      <p class="u-italic"><strong>Evitez les papillons</strong> : <br> Ils ralentiront votre progression !</p><br>
      <p class="u-italic">L’abeille pourrait éventuellement devenir <strong> incontrôlaaaaable </strong> ! Bonne chance
        &nbsp;
        <img class="popupPollen__icon" src="/images/popup/smile.svg" alt="blue smiley"></p>
    </Popup>

    <Popup class="popUpOutro hidden" ref="popUpOutro" label-button="Envie de rejouer ?" path="/outsideTwo" @action-on-click="reStart">
      <h2 class="popupPollen__title u-uppercase">Merci</h2>
      <p>XX fleurs<b></b> viennent d’être pollinisées</p>
      <img class="popupPollen__element" src="/images/popup/flower.svg" alt="blue smiley">
      <h2 class="popupPollen__title">Le saviez-vous ?</h2>
      <p>Une abeille peut polliniser jusqu’à 250 fleurs en 1h. On peut dire que c’est productif !</p>
    </Popup>

    <div class="chrono">
      <p></p>
    </div>
    <div class="loaderPollen hidden">
      <p></p>
    </div>
    <div class="count">
      <p></p>
    </div>
    <div class="lottieLoseForaged hidden">
      <lottie-player
          autoplay
          background="transparent"
          loop
          mode="normal"
          src="/lottie/pollenGame/LostFlower.json"
          style="width: 200px">
      </lottie-player>
    </div>
  </div>
</template>

<script lang="js">
import PollenGame from '@/webgl/scenes/PollenGameScene'
import TimelineComponent from '@/components/ui/TimelineComponent'
import WebGl from '@/webgl/webglManager'
import '@lottiefiles/lottie-player'
import Popup from '@/components/ui/Popup'

export default {
  name: 'PollenGame',
  components: {
    Popup,
    TimelineComponent
  },
  mounted() {
    const manager = new WebGl()
    this.webglInstance = new PollenGame()
    this.webglInstance.setDOM(this.$refs.pollenGameUI)

    setTimeout(() => {
      manager.loader.classList.add('loaded')
    }, 500)
  },

  methods: {
    startGame() {
      if (this.$refs.popUpIntro) {
        this.$refs.popUpIntro.$el.classList.add('hidden')
        this.webglInstance.playGame()
      }
    },
    reStart() {
      this.webglInstance.reStart()
    }
  },

}
</script>

<style scoped lang="scss">
.pollenGame {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .hidden {
    opacity: 0;
    display: none;
  }

  .popupPollen {
    font-size: 12px;
    color: $black;

    &__element {
      margin: 25px 15px;
    }

    &__title {
      font-size: 24px;
      font-family: 'RoadRage', sans-serif;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .attention {
      color: $blueGreen;
      font-family: 'RoadRage', sans-serif;
      font-size: 16px !important;
    }

    .espace {
      color: $blueGreen;
      font-family: 'RoadRage', sans-serif;
      border: 1px solid $blueGreen;
      padding: 2px 16px;
      border-radius: 2px;
    }

    svg {
      margin-bottom: 18px;
    }
  }


  .chrono {
    position: absolute;
    right: 110px;
    top: 64px;
    background-color: red;
  }

  .count {
    position: absolute;
    left: 110px;
    bottom: 64px;
    color: white;
  }

  .loaderPollen {
    position: absolute;
    background-color: red;
    opacity: 1;
    transition: opacity .3s;

    &.hidden {
      opacity: 0;
    }
  }

  .lottieLoseForaged {
    &.hidden {
      display: none;
    }
  }
}

</style>