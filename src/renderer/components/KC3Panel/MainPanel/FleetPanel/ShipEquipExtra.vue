<template>
    <div v-if="shipExtraSlotOpen(shipId)">
        <div class="fleet_ship--info_equip_extra">
            <img v-if="shipExtraGearId(shipId)>0" :src="shipExtraGearTypeSrc">
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'ShipEquipExtra',
    props: ['shipId'],
    computed: {
      ...mapGetters(['shipExtraSlotOpen', 'shipExtraGearId', 'shipExtraGearType']),
      shipExtraGearTypeSrc () {
        return require(`@/assets/img/itemtypes/${this.shipExtraGearType(this.shipId)}.png`)
      }
    }
  }
</script>
