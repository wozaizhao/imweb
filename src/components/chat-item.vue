<template>
  <div @click="itemClick">
    <div class="chat_item slide-left" :class="{'active': active,'top': top}" >
      <div class="ext">
        <p class="attr"></p>
        <!-- <p v-if="chatContact.isMuted()" class="attr no_time" :class="{'no_time': !chatContact.MMDigestTime}" >
          <i class="web_wechat_no-remind" :class="{'web_wechat_no-remind_hl': (chatContact.UserName == currentUserName)}" ></i>
        </p> -->
      </div>
      <div class="avatar" style="width:40px;height:40px;background:#ddd;line-height:40px;text-align:center;">
        <!-- <img :src="'https://wx.qq.com/'+contact.avatar" /> -->

        <!-- {{getLastLetter(contact.name)}} -->
      </div>
      <div class="info">
        <h3 class="nickname">
          <span class="nickname_text">{{contact.alias ? contact.alias : contact.name}}</span>
        </h3>
        <p class="msg" v-if="contact.text">
          <span>
            {{contact.text}}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chatItem',
  props: {
    contact: {
      type: Object
    },
    active: {
      type: Boolean,
      default: false
    },
    top: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getLastLetter (name) {
      return name.slice(-1)
    },
    itemClick () {
      this.$emit('item-click', this.contact)
    }
  }
}
</script>

<style>
</style>
