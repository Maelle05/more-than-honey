<template>
  <div class="hive">
    <Button label="Suivant" to="/outsideOne"/>
    <TimelineComponent/>
    <div ref="point0" class="hive__point">
      <div class="pointer"/>
      <div class="text">
        <div class="close"/>
        <img src="@/assets/images/hive/ventileuse-role.svg" alt="">
        <h3 class="name">La ventileuse</h3>
        <p class="label">raffraîchit</p>
        <p class="content">Maintient la ruche à 35°C maximum.Régule la température, contrôle le taux d’humidité et aére la ruche.</p>
      </div>
    </div>
    <div ref="point1" class="hive__point">
      <div class="pointer"/>
      <div class="text">
        <div class="close"/>
        <img src="@/assets/images/hive/ventileuse-role.svg" alt="">
        <h3 class="name">La ventileuse</h3>
        <p class="label">raffraîchit</p>
        <p class="content">Maintient la ruche à 35°C maximum.Régule la température, contrôle le taux d’humidité et aére la ruche.</p>
      </div>
    </div>
    <div ref="point2" class="hive__point">
      <div class="pointer"/>
      <div class="text">
        <div class="close"/>
        <img src="@/assets/images/hive/ventileuse-role.svg" alt="">
        <h3 class="name">La ventileuse</h3>
        <p class="label">raffraîchit</p>
        <p class="content">Maintient la ruche à 35°C maximum.Régule la température, contrôle le taux d’humidité et aére la ruche.</p>
      </div>
    </div>
    <div ref="point3" class="hive__point">
      <div class="pointer"/>
      <div class="text">
        <div class="close"/>
        <img src="@/assets/images/hive/ventileuse-role.svg" alt="">
        <h3 class="name">La ventileuse</h3>
        <p class="label">raffraîchit</p>
        <p class="content">Maintient la ruche à 35°C maximum.Régule la température, contrôle le taux d’humidité et aére la ruche.</p>
      </div>
    </div>
    <div ref="point4" class="hive__point">
      <div class="pointer"/>
      <div class="text">
        <div class="close"/>
        <img src="@/assets/images/hive/ventileuse-role.svg" alt="">
        <h3 class="name">La ventileuse</h3>
        <p class="label">raffraîchit</p>
        <p class="content">Maintient la ruche à 35°C maximum.Régule la température, contrôle le taux d’humidité et aére la ruche.</p>
      </div>
    </div>
    <div ref="point5" class="hive__point">
      <div class="pointer"/>
      <div class="text">
        <div class="close"/>
        <img src="@/assets/images/hive/ventileuse-role.svg" alt="">
        <h3 class="name">La ventileuse</h3>
        <p class="label">raffraîchit</p>
        <p class="content">Maintient la ruche à 35°C maximum.Régule la température, contrôle le taux d’humidité et aére la ruche.</p>
      </div>
    </div>
    <div ref="point6" class="hive__point">
      <div class="pointer"/>
      <div class="text">
        <div class="close"/>
        <img src="@/assets/images/hive/ventileuse-role.svg" alt="">
        <h3 class="name">La ventileuse</h3>
        <p class="label">raffraîchit</p>
        <p class="content">Maintient la ruche à 35°C maximum.Régule la température, contrôle le taux d’humidité et aére la ruche.</p>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import HiveScene from '@/webgl/scenes/HiveScene'
import TimelineComponent from '@/components/ui/TimelineComponent'
import Button from '@/components/ui/PrimaryButton'

export default {
  name: 'Hive',
  components: {
    TimelineComponent,
    Button
  },
  mounted() {
    const scene = new HiveScene()
    const points = [
      this.$refs.point0,
      this.$refs.point1,
      this.$refs.point2,
      this.$refs.point3,
      this.$refs.point4,
      this.$refs.point5,
      this.$refs.point6
    ]

    scene.setUpPointsFromDOM(points)
  }
}

</script>

<style lang="scss">
.hive {
  width: 100vw;
  height: 100vh;
  pointer-events: none;

  &__point {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
    color: $white;
    text-align: center;

    .pointer {
      height: 32px;
      width: 32px;
      background: $white;
      border-radius: 50%;
      position: absolute;
      top: 20px;
      left: -60px;
      box-shadow: 0 0 23px 5px $white;

      transform: scale(1, 1);
      transition: transform 0.3s;
    }

    .text {
      position: absolute;
      top: 30px;
      left: -160px;
      width: 300px;
      color: $black;
      background-color: $white;
      line-height: 1.3em;
      font-weight: 100;
      padding: 16px 16px 30px 16px;
      text-align: center;
      border-radius: 16px;
      z-index: 4;

      transform: scale(0, 0);
      transition: transform 0.3s;

      .close {
        position: absolute;
        right: 24px;
        top: 24px;
        width: 16px;
        height: 3px;
        border-radius: 2px;
        background: $blueGreen;
      }

      .name {
        font-size: 16px;
        padding-bottom: 3px;
      }

      .content {
        font-size: 12px;
      }

      .label {
        font-size: 12px;
        color: $blueGreen;
        padding-bottom: 20px;
      }
    }
  }

  .visible {
    .text {
      transform: scale(1, 1);
      transition: transform 0.3s;
    }
  }
}
</style>
