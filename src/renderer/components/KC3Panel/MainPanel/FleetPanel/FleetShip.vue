<template>
    <div class="fleet_ship" :class={in_dock:shipIsInDock(shipId)}>
        <div class="fleet_ship--image"><img :src="shipImageSrc"></div>
        <div class="fleet_ship--info">
            <div>
                <div class="fleet_ship--lvl_box">
                    <div>Lv</div>
                    <div :class="shipLvLCss(shipId)">{{ shipLvL(shipId) }}</div>
                </div>
                <ship-hp :shipId="shipId"></ship-hp>
            </div>
            <div class="fleet_ship--info_name">{{ shipName(shipId) }}</div>
            <div class="fleet_ship--info_equip_box">
                <ship-equip :shipId="shipId"></ship-equip>
                <ship-equip-extra :shipId="shipId"></ship-equip-extra>
            </div>
        </div>
        <div class="fleet_ship--status" :class="extraStatusCss">
            <ship-morale :shipId="shipId"></ship-morale>
            <ship-fuel :shipId="shipId"></ship-fuel>
            <ship-ammo :shipId="shipId"></ship-ammo>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import ShipFuel from './ShipFuel'
  import ShipHp from './ShipHp'
  import ShipEquip from './ShipEquip'
  import ShipEquipExtra from './ShipEquipExtra'
  import ShipMorale from './ShipMorale'
  import ShipAmmo from './ShipAmmo'

  export default {
    name: 'FleetShip',
    components: {ShipAmmo, ShipMorale, ShipEquipExtra, ShipEquip, ShipHp, ShipFuel},
    props: ['shipId'],
    computed: {
      ...mapGetters(['shipExpReady', 'shipIsInDock', 'shipHpCurrent', 'shipHpMax', 'shipMasterId', 'shipLvL', 'shipLvLCss', 'shipName', 'shipData']),
      shipImageSrc () {
        if (Math.ceil(this.shipHpCurrent(this.shipId) / this.shipHpMax(this.shipId) / 0.25) > 2) {
          return require(`@/assets/img/ships/${this.shipMasterId(this.shipId)}.png`)
        } else {
          return require(`@/assets/img/ships/${this.shipMasterId(this.shipId)}_d.png`)
        }
      },
      extraStatusCss () {
        switch (this.shipExpReady(this.shipId)) {
          case 1:
            return 'gs'
          case 0:
            return ''
          case -1:
            return 'fail'
        }
      }
    }
  }
</script>
