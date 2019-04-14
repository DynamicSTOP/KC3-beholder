<template>
    <div class="fleet_panel">
        <div class="fleet_panel--fleet_selector">
            <div>1+2</div>
            <div class="selected">1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
        </div>
        <div class="fleet_panel--fleet_ships">
            <fleet-ship v-for="(ship, index) in ships"
                        :shipId="ship"
                        :key="'fpfs_'+index">
            </fleet-ship>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import FleetShip from './FleetPanel/FleetShip'

  export default {
    name: 'FleetPanel',
    computed: {
      ...mapGetters(['uiCurrentFleet', 'deckShipIds']),
      ships () {
        return this.deckShipIds(this.uiCurrentFleet)
      }
    },
    components: {FleetShip}
  }
</script>
