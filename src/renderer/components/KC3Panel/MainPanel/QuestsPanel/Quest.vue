<template>
    <div class="quest">
        <div class="quest--category">
            <div :class="'cat_'+questCategory">{{ code }}</div>
        </div>
        <div class="quest--info" :title="title" :class="{bg_dark:this.collapsed}">
            <div class="quest--title" @click="collapsed=!collapsed">{{ title }}</div>
            <div class="quest--details" :class="{collapsed:this.collapsed}">
                <div>{{ description }}</div>
                <div class="quest--rsc">
                    <div v-for="(rsc,i) in rewardRsc" :key="'q_'+quest.api_no+'_rsc_'+i">
                        <div :title="i+' '+rsc"><img :src="resourceSrc(i)">{{ rsc }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="quest--status" :class="statusClass">{{status}}</div>
        <div class="quest--rewards">
            <div class="quest--reward-block" v-for="(reward, i) in rewards.other" :key="'q_'+quest.api_no+'_rwo_'+i">
                <template v-if="reward.choices">
                    <template v-for="(choice,ri) in reward.choices">
                        <reward :reward="choice" :key="'q_'+quest.api_no+'_rwo_'+i+'_c_'+ri"></reward>
                        <div v-if="ri!==reward.choices.length-1" class="quest--reward-or" :class="'ccolor_'+i">/</div>
                    </template>
                </template>
                <template v-else>
                    <reward v-if="!reward.choices" :reward="reward"></reward>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
  import quests from '@/generated/quests'
  import CONSTANTS from '@/helpers/constants'
  import Reward from './Reward'

  export default {
    name: 'Quest',
    data () {
      return {
        collapsed: false
      }
    },
    props: ['quest'],
    components: {Reward},
    computed: {
      title () {
        return quests[this.quest.api_no] ? (quests[this.quest.api_no].name.en || quests[this.quest.api_no].name.jp) : this.quest.api_title
      },
      description () {
        return quests[this.quest.api_no] ? (quests[this.quest.api_no].description.en || quests[this.quest.api_no].detail) : this.quest.api_detail
      },
      code () {
        return quests[this.quest.api_no] ? (quests[this.quest.api_no].wikia_id || quests[this.quest.api_no].wiki_id) : this.quest.api_no
      },
      questCategory () {
        return quests[this.quest.api_no] ? quests[this.quest.api_no].category : this.quest.api_category
      },
      statusClass () {
        if (this.quest.api_state === CONSTANTS.QUEST_STATUS_ACTIVE) {
          return 'active'
        } else if (this.quest.api_state === CONSTANTS.QUEST_STATUS_AVAILABLE) {
          return 'available'
        }
        // FIXME add done and can't be done\unavailable
      },
      status () {
        if (this.quest.api_state === CONSTANTS.QUEST_STATUS_ACTIVE) {
          // selected
          return 'S'
        } else if (this.quest.api_state === CONSTANTS.QUEST_STATUS_AVAILABLE) {
          // available
          return 'A'
        }
      },
      rewards () {
        if (quests[this.quest.api_no]) {
          return quests[this.quest.api_no].rewards
        }
        return {
          rsc: {},
          other: []
        }
      },
      rewardRsc () {
        if (quests[this.quest.api_no]) {
          return quests[this.quest.api_no].rewards.rsc
        } else {
          // for new quests
          const rsc = {}
          this.quest.api_get_material.map((r, i) => {
            if (i === 0 && r > 0) {
              rsc.fuel = r
            } else if (i === 1 && r > 0) {
              rsc.ammo = r
            } else if (i === 2 && r > 0) {
              rsc.steel = r
            } else if (i === 3 && r > 0) {
              rsc.bauxite = r
            }
          })
          return rsc
        }
      }
    },
    methods: {
      resourceSrc (rsc) {
        return require(`@/assets/img/ui/${rsc}.png`)
      }
    }
  }
</script>
