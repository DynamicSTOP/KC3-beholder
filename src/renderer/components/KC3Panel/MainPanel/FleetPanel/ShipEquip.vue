<template>
    <div>
        <div v-for="(n,i) in shipSlotsNumber(shipId)" :key="'slotItem'+n" class="fleet_ship--info_equip">
            <img v-if="shipGearIds(shipId)[i]>0" :src="shipGearTypeSrcs[i]">
            <div v-if="shipGearLvls(shipId)[i]>0" class="fleet_ship--gear_lvl">
                {{ shipGearLvlsText[i] }}
            </div>
            <div v-if="shipPlanesInMasterSlot(shipId)[i] > 0" class="fleet_ship--planes_number">
                {{ shipPlanesInSlot(shipId)[i] }}
            </div>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'ShipEquip',
    props: ['shipId'],
    computed: {
      ...mapGetters(['shipSlotsNumber', 'shipGearTypes', 'shipGearIds', 'shipPlanesInMasterSlot', 'shipPlanesInSlot', 'shipGearLvls']),
      shipGearLvlsText () {
        return this.shipGearLvls(this.shipId).map(l => l === 10 ? '★' : l)
      },
      shipGearTypeSrcs () {
        return this.shipGearTypes(this.shipId).map(g => require(`@/assets/img/itemtypes/${g}.png`))
      }
    }
  }
</script>
