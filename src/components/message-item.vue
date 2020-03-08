<template>
  <div class="message" :class="{me: message.self}">
    <span class="nickname" v-show="!message.self">{{message.from.payload.alias ? message.from.payload.alias : message.from.payload.name }}</span>
    <!-- <div class="avatar" style="width:40px;height:40px;background:#ddd;line-height:40px;text-align:center;">
    </div> -->
    <img class="avatar" @error="avatarLoadOnError()" :src="avatarUrl"/>
    <!-- <img v-if="message.self" class="avatar" :src="baseUrl + account.name + '-avatar.jpg'"/> -->
    <!-- <img v-else class="avatar" @error="avatarLoadOnError(message.from.payload.name)" :src="baseUrl + fromAvatar"/> -->
    <div v-if="message.type === 7" class="content">
      <div class="bubble js_message_bubble bubble_primary" :class="{right: message.self, left: !message.self}">
        <div class="bubble_cont">
          <div class="plain">
            <pre class="js_message_plain" v-html="message.text"></pre>
            <!-- <img
                      ng-show="message.MMStatus == 1"
                      class="ico_loading ng-hide"
                      src="//res.wx.qq.com/a/wx_fed/webwx/res/static/img/xasUyAI.gif"
                      alt
            />-->
            <!-- <i
                      class="ico_fail web_wechat_message_fail ng-hide"
                      ng-click="resendMsg(message)"
                      ng-show="message.MMStatus == 5"
                      title="Resend"
            ></i>-->
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="message.type === 6" class="content">
      <div class="bubble js_message_bubble bubble_default no_arrow" :class="{right: message.self, left: !message.self}">
        <div class="bubble_cont">
          <div class="picture">
            <img class="msg-img" :src="baseUrl + 'pic/' + message.text" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'messageItem',
  props: {
    message: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      baseUrl: process.env.API,
      default: require('../assets/avatar_contact.png'),
      contactName: '',
      avatar: '',
      avatarUrl: null
    }
  },
  mounted () {
    this.avatarUrl = this.default
    console.log('self', this.message.self)
    this.contactName = this.message.self ? this.account.name : this.message.from.payload.name
    console.log('contactName', this.contactName)
    this.avatar = this.contactName + '-avatar.jpg'
    fetch(this.baseUrl + this.avatar).then((res) => {
      if (res.status === 404) {
        console.log('404')
        this.$socket.emit('getavatar', {room: false, name: this.contactName, message: true})
      } else if (res.status === 200) {
        this.setAvatart()
      }
    })
  },
  computed: {
    ...mapState({
      account: state => state.user.account
    })
  },
  methods: {
    setAvatart () {
      this.avatarUrl = this.baseUrl + this.avatar
    },
    avatarLoadOnError () {
      this.avatarUrl = this.default
    }
  },
  sockets: {
    messageavatar: function (name) {
      console.log('avatar ok')
      if (this.contactName === name) {
        this.setAvatart()
      }
    }
  }
}
</script>

<style>
</style>
