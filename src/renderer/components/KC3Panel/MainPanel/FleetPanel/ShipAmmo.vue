<template>
    <div class="fleet_ship--status-ammo" :title="shipAmmo(shipId)+'/'+shipMaxAmmo(shipId)">
        <div class=""></div>
        <img v-for="n in ammoNum" :src="ammoSrc">
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'ShipAmmo',
    props: ['shipId'],
    computed: {
      ...mapGetters(['shipAmmo', 'shipMaxAmmo']),
      ammoNum () {
        if (this.shipAmmo(this.shipId) === this.shipMaxAmmo(this.shipId)) {
          return 4
        }
        return Math.floor((this.shipAmmo(this.shipId) / this.shipMaxAmmo(this.shipId)) / 0.2)
      },
      ammoSrc () {
        const percent = Math.ceil((this.shipAmmo(this.shipId) / this.shipMaxAmmo(this.shipId)) * 100)
        if (percent === 100) {
          return require('@/assets/img/ui/shell.svg')
        } else {
          return require('@/assets/img/ui/shell-red.svg')
        }
      }
    }
  }
</script>
