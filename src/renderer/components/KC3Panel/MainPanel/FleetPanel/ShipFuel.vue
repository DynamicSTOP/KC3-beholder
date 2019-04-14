<template>
    <div class="fleet_ship--status-fuel" :title="shipFuel(shipId)+'/'+shipMaxFuel(shipId)">
        <img :src="fuelSrc">
        <img :src="fuelSrc">
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'ShipFuel',
    props: ['shipId'],
    computed: {
      ...mapGetters(['shipFuel', 'shipMaxFuel']),
      fuelSrc () {
        const percent = Math.ceil((this.shipFuel(this.shipId) / this.shipMaxFuel(this.shipId)) * 100)
        if (percent === 100) {
          return require('@/assets/img/ui/barrel-green.svg')
        } else if (percent >= 60) {
          return require('@/assets/img/ui/barrel-yellow.svg')
        } else if (percent >= 20) {
          return require('@/assets/img/ui/barrel-orange.svg')
        } else {
          return require('@/assets/img/ui/barrel-red.svg')
        }
      }
    }
  }
</script>
