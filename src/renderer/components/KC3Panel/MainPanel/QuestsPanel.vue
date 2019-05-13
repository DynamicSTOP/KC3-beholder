<template>
    <div class="quests_panel">
        <div class="quests_panel--filters">
            <div @click="switchFilter('current')" :class="{active:uiCurrentQuestFilter==='current'}" title="Current">*
            </div>
            <div @click="switchFilter('all')" :class="{active:uiCurrentQuestFilter==='all'}" title="All">A</div>
            <div @click="switchFilter('daily')" :class="{active:uiCurrentQuestFilter==='daily'}" title="Daily">D</div>
            <div @click="switchFilter('weekly')" :class="{active:uiCurrentQuestFilter==='weekly'}" title="Weekly">W
            </div>
            <div @click="switchFilter('monthly')" :class="{active:uiCurrentQuestFilter==='monthly'}" title="Monthly">M
            </div>
            <div @click="switchFilter('quarterly')" :class="{active:uiCurrentQuestFilter==='quarterly'}"
                 title="Quarterly">Q
            </div>
            <div @click="switchFilter('once')" :class="{active:uiCurrentQuestFilter==='once'}" title="Once">O</div>
        </div>
        <div class="quests_panel--quests" :class="{active:uiCurrentQuestFilter==='current'}">
            <quest v-for="(quest) in questsActive" :key="'quest_c'+quest.api_no" :quest="quest"></quest>
        </div>
        <div class="quests_panel--quests" :class="{active:uiCurrentQuestFilter==='all'}">
            <quest v-for="(quest) in questsAll" :key="'quest_a'+quest.api_no" :quest="quest"></quest>
        </div>
        <div class="quests_panel--quests" :class="{active:uiCurrentQuestFilter==='daily'}">
            <quest v-for="(quest) in questsDaily" :key="'quest_d'+quest.api_no" :quest="quest"></quest>
        </div>
        <div class="quests_panel--quests" :class="{active:uiCurrentQuestFilter==='weekly'}">
            <quest v-for="(quest) in questsWeekly" :key="'quest_w'+quest.api_no" :quest="quest"></quest>
        </div>
        <div class="quests_panel--quests" :class="{active:uiCurrentQuestFilter==='monthly'}">
            <quest v-for="(quest) in questsMonthly" :key="'quest_m'+quest.api_no" :quest="quest"></quest>
        </div>
        <div class="quests_panel--quests" :class="{active:uiCurrentQuestFilter==='quarterly'}">
            <quest v-for="(quest) in questsQuarterly" :key="'quest_q'+quest.api_no" :quest="quest"></quest>
        </div>
        <div class="quests_panel--quests" :class="{active:uiCurrentQuestFilter==='once'}">
            <quest v-for="(quest) in questsOnce" :key="'quest_o'+quest.api_no" :quest="quest"></quest>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Quest from './QuestsPanel/Quest'

  export default {
    name: 'QuestsPanel',
    components: {Quest},
    computed: {
      ...mapGetters(['questsActive', 'questsAll', 'questsDaily', 'questsWeekly', 'questsMonthly', 'questsQuarterly',
        'questsOnce', 'questsAvailable', 'questsComplete', 'uiCurrentQuestFilter'])
    },
    methods: {
      switchFilter (filter) {
        this.$store.dispatch('UI_SWITCH_CURRENT_QUEST_FILTER', filter)
      }
    }
  }
</script>
