<template>
  <div class="ending">
    <div class="credits">
      <img class="logo" src="@/assets/images/logo.svg" alt="white logo of the project 'more than honey'">
      <p class="u-uppercase credits__text">Une création originale de</p>

      <a v-for="(name, i) in content.group" :key="i" target="_blank" class="u-uppercase credits__name"
         :href="name.link">
        {{ name.name }}<br/>
        <span class="credits__role">{{ name.role }}</span>
      </a>

      <span class="bullet"></span>
      <p class="u-uppercase credits__text">Avec la participation de </p>
      <a v-for="(name, i) in content.sound" :key="i + 5" target="_blank" class="u-uppercase credits__name"
         :href="name.link">
        {{ name.name }}<br/>
        <span class="credits__role">{{ name.role }}</span>
      </a>

      <span class="bullet"></span>

      <p class="u-uppercase credits__text">Merci également à toute l’équipe Gobelins pour leurs conseils et encouragements</p>

      <ul>
        <li v-for="(name, i) in content.teacher" :key="i + 7" class="u-uppercase credits__name">
          {{name.name}}
        </li>
      </ul>

      <p class="u-uppercase credits__name">Et bien d'autres encore...</p>
      <img class="credits__image" src="@/assets/images/gobelins.png" alt="logo of the Gobelins school">
    </div>
  </div>
</template>

<script lang="js">
import creditsContent from '../../public/data/creditsContent.json'

export default {
  name: 'Ending',
  data() {
    return {
      content: creditsContent[0]
    }
  }
}
</script>

<style scoped lang="scss">
.ending {
  background-color: #00000085;
  opacity: 0;
}

.credits {
  width: 100vw;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  img {
    margin-top: 80px;
  }

  &__text {
    font-family: 'Lato', sans-serif;
    font-size: 16px;
    margin-bottom: 24px;
    font-weight: 900;
  }

  &__image {
    width: 150px;
  }

  &__name {
    margin-bottom: 32px;
    font-family: 'RoadRage', sans-serif;
    font-size: 24px;
    color: white;
    text-align: center;
  }

  &__role {
    font-family: 'Lato', sans-serif;
    font-size: 16px;
    margin-top: 8px;
    text-transform: none !important;
  }

  .bullet {
    display: block;
    background-color: $white;
    border-radius: 50%;
    margin: 0 0 40px 0;
    width: 8px;
    height: 8px;
  }
}

</style>