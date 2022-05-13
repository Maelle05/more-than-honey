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

    <div class="chrono hidden">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="path-1-inside-1_1419_410" fill="white">
        <path d="M24.5054 7.67294L25.4708 6.15594C25.8994 5.48231 25.7008 4.58869 25.0272 4.16C24.3536 3.73125 23.46 3.92994 23.0313 4.60369L22.0682 6.11713C20.649 5.40988 19.0906 4.94225 17.4456 4.76837V2.89156H17.5361C18.3345 2.89156 18.9819 2.24425 18.9819 1.44575C18.9819 0.64725 18.3345 0 17.5361 0H14.4634C13.665 0 13.0176 0.647312 13.0176 1.44581C13.0176 2.24431 13.6649 2.89162 14.4634 2.89162H14.554V4.76844C7.7022 5.49281 2.3457 11.3054 2.3457 18.3459C2.3457 25.8748 8.47089 32 15.9998 32C23.5286 32 29.6538 25.8748 29.6538 18.3459C29.6538 14.0304 27.641 10.1769 24.5054 7.67294Z"/>
        </mask>
        <path d="M14.4473 18.3222C14.134 18.7771 14.2489 19.3997 14.7037 19.7129C15.1586 20.0262 15.7813 19.9113 16.0945 19.4564L14.4473 18.3222ZM19.8055 14.0671C20.1187 13.6123 20.0039 12.9896 19.549 12.6764C19.0942 12.3632 18.4715 12.478 18.1583 12.9329L19.8055 14.0671ZM16.0945 19.4564L19.8055 14.0671L18.1583 12.9329L14.4473 18.3222L16.0945 19.4564ZM24.5054 7.67294L22.8181 6.59918L21.8536 8.11477L23.2574 9.23577L24.5054 7.67294ZM25.4708 6.15594L27.1581 7.2297L27.1581 7.22961L25.4708 6.15594ZM25.0272 4.16L23.9532 5.84719L23.9534 5.8473L25.0272 4.16ZM23.0313 4.60369L24.7186 5.67741L24.7187 5.67733L23.0313 4.60369ZM22.0682 6.11713L21.1762 7.90718L22.7885 8.71062L23.7555 7.19085L22.0682 6.11713ZM17.4456 4.76837H15.4456V6.56812L17.2354 6.7573L17.4456 4.76837ZM17.4456 2.89156V0.891562H15.4456V2.89156H17.4456ZM14.554 2.89162H16.554V0.891625H14.554V2.89162ZM14.554 4.76844L14.7643 6.75735L16.554 6.56814V4.76844H14.554ZM29.6538 18.3459H31.6538H29.6538ZM26.1927 8.7467L27.1581 7.2297L23.7835 5.08218L22.8181 6.59918L26.1927 8.7467ZM27.1581 7.22961C28.1797 5.62416 27.7065 3.49442 26.101 2.4727L23.9534 5.8473C23.6952 5.68296 23.6191 5.34046 23.7834 5.08227L27.1581 7.22961ZM26.1012 2.47281C24.4953 1.45063 22.3654 1.92459 21.3439 3.53005L24.7187 5.67733C24.5545 5.93528 24.212 6.01187 23.9532 5.84719L26.1012 2.47281ZM21.3439 3.52996L20.3809 5.0434L23.7555 7.19085L24.7186 5.67741L21.3439 3.52996ZM22.9602 4.32707C21.3323 3.51583 19.5435 2.97898 17.6558 2.77945L17.2354 6.7573C18.6377 6.90552 19.9656 7.30392 21.1762 7.90718L22.9602 4.32707ZM19.4456 4.76837V2.89156H15.4456V4.76837H19.4456ZM17.4456 4.89156H17.5361V0.891562H17.4456V4.89156ZM17.5361 4.89156C19.439 4.89156 20.9819 3.34888 20.9819 1.44575H16.9819C16.9819 1.13962 17.23 0.891562 17.5361 0.891562V4.89156ZM20.9819 1.44575C20.9819 -0.457488 19.4389 -2 17.5361 -2V2C17.2301 2 16.9819 1.75199 16.9819 1.44575H20.9819ZM17.5361 -2H14.4634V2H17.5361V-2ZM14.4634 -2C12.5604 -2 11.0176 -0.457315 11.0176 1.44581H15.0176C15.0176 1.75194 14.7695 2 14.4634 2V-2ZM11.0176 1.44581C11.0176 3.34888 12.5603 4.89162 14.4634 4.89162V0.891625C14.7695 0.891625 15.0176 1.13974 15.0176 1.44581H11.0176ZM14.4634 4.89162H14.554V0.891625H14.4634V4.89162ZM12.554 2.89162V4.76844H16.554V2.89162H12.554ZM14.3437 2.77952C6.48628 3.61021 0.345703 10.2703 0.345703 18.3459H4.3457C4.3457 12.3404 8.91813 7.37541 14.7643 6.75735L14.3437 2.77952ZM0.345703 18.3459C0.345703 26.9794 7.36632 34 15.9998 34V30C9.57546 30 4.3457 24.7702 4.3457 18.3459H0.345703ZM15.9998 34C24.6332 34 31.6538 26.9794 31.6538 18.3459H27.6538C27.6538 24.7702 22.4241 30 15.9998 30V34ZM31.6538 18.3459C31.6538 13.3943 29.3419 8.97574 25.7534 6.1101L23.2574 9.23577C25.94 11.378 27.6538 14.6666 27.6538 18.3459H31.6538Z" fill="white" mask="url(#path-1-inside-1_1419_410)"/>
      </svg>
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
    display: flex;
    align-items: center;
    right: 110px;
    top: 64px;

    svg {
      margin-right: 10px;
    }

    p {
      font-family: 'RoadRage', sans-serif;
      font-size: 40px;
      min-width: 100px;
    }

    &.hidden{
      display: none;
    }
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