<template>
    <div class="fleet_ship--hp_bar" :title="shipHpCurrent(shipId) + '/' + shipHpMax(shipId)">
        <img v-for="n in shipHpBarCount(shipId)" :src="shipHpBarSrc" class="hp-block"
             :class="{hp_last_dmg:n===4 && (shipHpMax(shipId) !== shipHpCurrent(shipId))}"
             :key="'hpBar'+n"/>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'ShipHp',
    props: ['shipId'],
    computed: {
      ...mapGetters(['shipHpCurrent', 'shipHpBarCount', 'shipHpMax']),
      shipHpBarSrc () {
        const bars = Math.ceil((this.shipHpCurrent(this.shipId) / this.shipHpMax(this.shipId)) / 0.25)
        switch (bars) {
          case 4:
            return require('@/assets/img/ui/hpbar-green.svg')
          case 3:
            return require('@/assets/img/ui/hpbar-yellow.svg')
          case 2:
            return require('@/assets/img/ui/hpbar-orange.svg')
          case 1:
            return require('@/assets/img/ui/hpbar-red.svg')
        }
      }
    }
  }
</script>
