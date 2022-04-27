<template>
  <div class="hive">
    <Button label="Suivant" to="/outsideOne"/>
    <TimelineComponent/>
    <div ref="point0" class="hive__point p0">
      <div class="label">1</div>
      <div class="text">Mais si tu m'apprivoises, nous aurons besoin l'un de l'autre. Tu seras pour moi unique au monde.
        Je serai pour toi unique au monde.
      </div>
    </div>

    <div ref="point1" class="hive__point p1">
      <div class="label">2</div>
      <div class="text">Toutes les grandes personnes ont d’abord été des enfants. Mais peu d’entre elles s’en
        souviennent.
      </div>
    </div>
    <div ref="point2" class="hive__point p2">
      <div class="label">3</div>
      <div class="text">On ne voit bien qu’avec le cœur. L’essentiel est invisible pour les yeux.</div>
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
      this.$refs.point2
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
      width: 40px;
      top: -20px;
      left: -20px;
      height: 40px;
      border-radius: 50%;
      background-color: #00000077;
      color: white;
      text-align: center;
      line-height: 40px;
      font-weight: 100;
      font-size: 14px;

      transform: scale(0, 0);
      transition: transform 0.3s;
    }

    .text {
      position: absolute;
      top: 30px;
      left: -160px;
      width: 300px;
      color: white;
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
    .label, .text {
      transform: scale(1, 1);
      transition: transform 0.3s;
    }
  }
}
</style>
