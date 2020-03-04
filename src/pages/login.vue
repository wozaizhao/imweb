<template>
  <div :class="{loaded:isLoaded,unlogin:isUnLogin}" >
    <div class="login">
      <!--BEGIN logo-->
      <div class="logo">
        <i class="web_wechat_login_logo"></i>
      </div>
      <!--END logo-->
      <!--BEGIN login_box-->
      <div class="login_box">
        <div class="qrcode" :class="{hide: isScan || isAssociationLogin || isBrokenNetwork}">
          <img
            class="img"
            :class="{'qrcode_expired': isNeedRefresh}"
            :src="qrcodeUrl"
          />
          <div v-show="!isNeedRefresh">
            <p class="sub_title">Scan to log in to WeChat</p>
            <p class="sub_desc" v-if="showPrivacyTips">
              <span>Tip: Web WeChat requires the use browser cookies to help you log in to allow the web application to function.</span>
              <br />
              <a href="https://www.wechat.com/en/cookies_policy.html" target="_blank">More Information</a>
            </p>
            <p class="sub_desc" ng-if="!showPrivacyTips">Log in on phone to use WeChat on Web</p>
          </div>
          <div v-show="isNeedRefresh">
            <div class="refresh_qrcode_mask">
              <i
                class="icon-refresh"
                :class="{rotateLoading: isRotateLoading}"
                @click="refreshQrcode()"
              ></i>
            </div>
            <p class="refresh_tips">QR Code expired&#44;Click Refresh</p>
          </div>
        </div>
        <div class="avatar" :class="{show: !isAssociationLogin && !isBrokenNetwork && isScan}">
          <img class="img" :src="userAvatar" />
          <!-- <h4 class="sub_title">Scan successful</h4> -->
          <!-- <p class="tips">Confirm login on mobile WeChat</p> -->
          <a href="javascript:;" @click="isScan = false;" class="action">Switch Account</a>
          <p class="sub_desc" v-if="showPrivacyTips">
            <span>Tip: Web WeChat requires the use browser cookies to help you log in to allow the web application to function.</span>
            <br />
            <a href="https://www.wechat.com/en/cookies_policy.html" target="_blank">More Information</a>
          </p>
        </div>
        <div class="association" :class="{show: isAssociationLogin && !isBrokenNetwork}">
          <img class="img" :src="userAvatar" />
          <p v-show="isWaitingAsConfirm" class="waiting_confirm">Confirm login on mobile WeChat</p>
          <a
            href="javascript:;"
            v-show="!isWaitingAsConfirm"
            @click="associationLogin()"
            class="button button_primary"
          >Log in</a>
          <a href="javascript:;" @click="qrcodeLogin()" class="button button_default">Switch Account</a>
          <p class="sub_desc" v-if="showPrivacyTips">
            <span>Tip: Web WeChat requires the use browser cookies to help you log in to allow the web application to function.</span>
            <br />
            <a href="https://www.wechat.com/en/cookies_policy.html" target="_blank">More Information</a>
          </p>
        </div>
        <div class="broken_network" :class="{show: isBrokenNetwork}">
          <div class="icon-broken-logo"></div>
          <h4 class="sub_title">Network unavailable</h4>
          <p class="sub_desc">
            Please check your network configuration
            <span @click="reloadQrcode()" class="reconnect" :class="{show: isClientVersion}">点击重连</span>
          </p>
        </div>
      </div>
      <!--END login_box-->
      <!--BEGIN copyright-->
      <div class="copyright">
        <p class="desc">&copy; 1998 - 2020 Tencent Inc. All Rights Reserved</p>
      </div>
      <!--END copyright-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      isLoaded: false,
      isUnLogin: true,
      isScan: false,
      isAssociationLogin: false,
      isBrokenNetwork: false,
      isNeedRefresh: false,
      isRotateLoading: false,
      qrcodeUrl: '//res.wx.qq.com/a/wx_fed/webwx/res/static/img/2z6meE1.gif',
      userAvatar: '//res.wx.qq.com/a/wx_fed/webwx/res/static/img/2KriyDK.png',
      showPrivacyTips: false,
      isWaitingAsConfirm: false,
      isClientVersion: false
    }
  },
  mounted () {
    const { from } = this.$route.query
    if (from === 'chat') {
      this.$socket.emit('getqrcode')
    }
  },
  methods: {

  },
  sockets: {
    connect: function () {
      console.log('socket connected')
      this.$socket.emit('getqrcode')
    },
    qrcode: function (res) {
      console.log('qrcode', res)
      if (res.status) {
        this.qrcodeUrl = res.qrcode
      }
    },
    login: function (res) {
      console.log(res)
      this.$store.dispatch('login', res.payload)
      this.$router.push('/chat')
    }
  }
}
</script>

<style>
</style>
