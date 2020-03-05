<template>
  <div class="message" :class="{me: message.self}">
    <p class="nickname">{{message.from.payload.alias ? message.from.payload.alias : message.from.payload.name }}</p>
    <div class="avatar" style="width:40px;height:40px;background:#ddd;line-height:40px;text-align:center;">
    </div>
    <div class="content">
      <div class="bubble js_message_bubble bubble_primary right">
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
  </div>
</template>

<script>
export default {
  name: 'messageItem',
  props: {
    message: {
      type: Object
    }
  }
}
</script>

<style>
</style>
