<template>
  <div class="hive">
    <Button label="Suivant" to="/outsideOne"/>
    <TimelineComponent/>
    <div ref="point0" class="hive__point">
      <div class="label">La ventileuse</div>
      <div class="text">Maintient la ruche à 35°C maximum. Régule la température, contrôle le taux d’humidité et aère la ruche.
      </div>
    </div>

    <div ref="point1" class="hive__point">
      <div class="label">La nettoyeuse</div>
      <div class="text">Entretient les rayons de la ruche et nettoie les cellules. Elle doit aussi réparer ce qui doit l'être.
      </div>
    </div>
    <div ref="point2" class="hive__point">
      <div class="label">La butineuse</div>
      <div class="text">Butiner est une sorte de prime d'ancienneté qui intervient au 21e/35 jours de vie. Ce sont les butineuses qui rapportent le nectar à la ruche.</div>
    </div>
    <div ref="point3" class="hive__point">
      <div class="label">La gardienne</div>
      <div class="text">Garde la ruche et empêche les rôdeurs et autres pillards attirés par le miel d'y venir.</div>
    </div>
    <div ref="point4" class="hive__point">
      <div class="label">L'architecte</div>
      <div class="text">Lorsqu’elle cesse de produire de la gelée royale, elle commence à sculpter les rayons de la ruche. On les appelle aussi les abeilles cirières.</div>
    </div>
    <div ref="point5" class="hive__point">
      <div class="label">La manutentionnaire</div>
      <div class="text">Faiseuse de miel. Avale le nectar et le fait transiter plusieurs fois entre leur trompe et leur jabot. Elle le transmet à une autre équipe, et ainsi de suite.</div>
    </div>
    <div ref="point6" class="hive__point">
      <div class="label">La nourricière</div>
      <div class="text">Nourrissent les jeunes larves et les larves royales. Lors d’une nouvelle volée d'abeilles, celles qui ont alors 6 jours prennent le relais.</div>
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

  &__point {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
    color: $white;
    text-align: center;

    //&:hover {
    //  .text {
    //    opacity: 1;
    //    transition: opacity 0.3s;
    //  }
    //}

    .label {
      position: absolute;
      top: -20px;
      left: -20px;
      height: 40px;
      border-radius: 8px;
      padding: 0 10px;
      background-color: #00000077;
      color: $white;
      text-align: center;
      font-weight: 100;
      font-size: 14px;

      transform: scale(1, 1);
      transition: transform 0.3s;
    }

    .text {
      position: absolute;
      top: 30px;
      left: -160px;
      width: 300px;
      color: $white;
      background-color: #00000077;
      line-height: 1.3em;
      font-weight: 100;
      font-size: 16px;
      padding: 10px;
      text-align: center;
      border-radius: 4px;

      pointer-events: none;

      transform: scale(0, 0);
      transition: transform 0.3s;

      //opacity: 0;
      //transition: opacity 0.3s;
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
