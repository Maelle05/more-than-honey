<template>
  <div class="ending">
    <div class="credits">
      <img class="logo" src="@/assets/images/logo.svg" alt="white logo of the project 'more than honey'">
      <h2>Une création originale de</h2>
      <a href="https://www.linkedin.com/in/leonie-grimoin/" target="_blank">LÉONIE GRIMOIN</a>
      <p>Développeuse interactive</p>
      <a href="https://www.linkedin.com/in/ma%C3%ABlle-rabouan-4b0776194/" target="_blank"> MAËLLE RABOUAN </a>
      <p>Développeuse interactive</p>
      <a href="https://www.linkedin.com/in/camille-robillard-049361157/" target="_blank"> CAMILLE ROBILLARD </a>
      <p>Designer interactive</p>
      <a href="https://www.linkedin.com/in/jessica-poulain-b890b310a/" target="_blank"> JESSICA POULAIN </a>
      <p>Designer interactive</p>
      <a href="https://www.linkedin.com/in/danny-lahcene-b28663187/" target="_blank"> DANNY LAHCENE </a>
      <p>Designer interactive</p>
      <span></span>
      <h2>Avec la participation de</h2>
      <a href="https://www.linkedin.com/in/ma%C3%ABlle-rabouan-4b0776194/" target="_blank"> ARTHUR LOICHOT </a>
      <p>Sound designer</p>
      <a href="https://www.linkedin.com/in/ma%C3%ABlle-rabouan-4b0776194/" target="_blank"> PIERRE-ANDRÉAS DURANT </a>
      <p>Voix</p>
      <span></span>
      <h2>Merci également à toute l’équipe Gobelins pour leurs conseils et encouragements</h2>
      <a>THIERRY AUDOUX</a>
      <a>Catherine Nyeki</a>
      <a>Thomas Menia</a>
      <a>Christophe Massolin</a>
      <a>François Marquet</a>
      <a>DORIAN LODS</a>
      <a>Christian Porri</a>
      <a>Adrien Lavisiera</a>
      <a>ET BIEN D’AUTRES ENCORE...</a>
      <img src="@/assets/images/gobelins.png" alt="" srcset="">
    </div>
  </div>
</template>

<script lang="js">
import Button from '@/components/ui/PrimaryButton'

export default {
  name: 'Home',
  components: {
  },
}
</script>

<style scoped lang="scss">
.ending{
  background-color: #00000085;
  opacity: 0;
}

.credits{
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  img{
    margin-top: 80px;
  }

  h2{
    margin-top: 24px;
    font-family: 'Lato';
    font-size: 20px;
    margin-bottom: 10px;
  }

  a{
    margin-top: 32px;
    font-family: 'Road Rage';
    font-size: 24px;
    color: white;
  }

  p{
    font-family: 'Lato';
    font-size: 16px;
    margin-top: 8px;
  }

  span{
    display: block;
    background-color: white;
    border-radius: 999999999px;
    margin: 40px 0 40px 0;
    width: 8px;
    height: 8px;
  }
}

</style>