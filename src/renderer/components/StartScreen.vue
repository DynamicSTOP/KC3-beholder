<template>
    <div class="startscreen">
        <div class="startscreen--menu">
            <div class="startscreen--flex">
                <label for="startscreen--host">Chrome IP:</label>
                <input id="startscreen--host" placeholder="localhost" @keyup="updateValue" @change="updateValue"
                       :value="startScreenHost">
            </div>
            <div class="startscreen--flex">
                <label for="startscreen--port">Chrome Port:</label>
                <input id="startscreen--port" placeholder="9222" @keyup="updateValue" @change="updateValue"
                       :value="startScreenPort">
            </div>
            <div class="startscreen--center">
                <input id="startscreen--auto" type="checkbox" :checked="startScreenAuto" @change="updateValue">
                <label for="startscreen--auto">Auto connect on start</label>
            </div>
            <div class="startscreen--center">
                <div class="startscreen--connect" @click="connectToChrome">Connect</div>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'StartScreen',
    computed: {
      ...mapGetters(['startScreenHost', 'startScreenPort', 'startScreenAuto'])
    },
    methods: {
      updateValue (event) {
        let key = event.target.id.replace('startscreen--', '')
        key = key[0].toUpperCase() + key.substring(1)
        let value = event.target.value
        if (key === 'Port') {
          value = value.replace(/[^\d]/g, '')
          event.target.value = value
        }
        this.$store.dispatch('UPDATE_SS_VALUE', {key, value})
      },
      connectToChrome () {
        this.$electron.ipcRenderer.send('connectToChrome', {host: this.startScreenHost, port: this.startScreenPort})
      }
    },
    mounted () {
      this.$electron.ipcRenderer.on('ConnectedToChrome', () => {
        this.$router.push({name: 'kc3-panel'})
      })
      if (this.startScreenAuto === 'on') {
        this.connectToChrome()
      }
    }
  }
</script>
