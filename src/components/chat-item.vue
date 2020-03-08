<template>
  <div @click="itemClick">
    <div class="chat_item slide-left" :class="{'active': active,'top': top}" >
      <div class="ext">
        <p class="attr"></p>
        <!-- <p v-if="chatContact.isMuted()" class="attr no_time" :class="{'no_time': !chatContact.MMDigestTime}" >
          <i class="web_wechat_no-remind" :class="{'web_wechat_no-remind_hl': (chatContact.UserName == currentUserName)}" ></i>
        </p> -->
      </div>
      <div class="avatar">
        <img class="img" @error="avatarLoadOnError()" :src="avatarUrl"/>
        <!-- <img class="img" @error="avatarLoadOnError(contact.name)" :src="baseUrl + avatar" /> -->
      </div>
      <div class="info">
        <h3 class="nickname">
          <span class="nickname_text">{{contact.alias ? contact.alias : contact.name}}</span>
        </h3>
        <p class="msg" v-if="contact.text">
          <span v-html="contact.text">
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
    },
    room: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      baseUrl: process.env.API,
      avatar: this.contact.name + '-avatar.jpg',
      default: null,
      avatarUrl: null
    }
  },
  mounted () {
    this.default = this.room ? require('../assets/avatar_group.png') : require('../assets/avatar_contact.png')
    this.avatarUrl = this.default
    fetch(this.baseUrl + this.avatar).then((res) => {
      if (res.status === 404) {
        console.log('404')
        this.$socket.emit('getavatar', {room: false, name: this.contact.name})
      } else if (res.status === 200) {
        this.setAvatart()
      }
    })
  },
  methods: {
    getLastLetter (name) {
      return name.slice(-1)
    },
    itemClick () {
      this.$emit('item-click', this.contact)
    },
    setAvatart () {
      this.avatarUrl = this.baseUrl + this.avatar
    },
    avatarLoadOnError () {
      this.avatarUrl = this.default
    }
  },
  sockets: {
    avatar: function (name) {
      console.log('avatar ok')
      if (this.contact.name === name) {
        this.setAvatart()
      }
    }
  }
}
</script>

<style>
</style>
