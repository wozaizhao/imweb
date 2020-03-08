<template>
  <div class="chat" :class="{loaded:isLoaded,unlogin:isUnLogin}">
    <div class="main">
      <div class="main_inner">
        <div class="panel give_me" :class="{give_me: showDownloadEntry}">
          <div class="header">
            <div class="avatar">
              <img class="img" :src="baseUrl + account.name + '-avatar.jpg'"/>
            </div>
            <div class="info">
              <h3 class="nickname">
                <span class="display_name">{{ account.name }}</span>
                <!-- <a
                  class="opt"
                  href="javascript:;"
                  ng-show="account.HeadImgUrl"
                  ng-click="toggleSystemMenu()"
                >
                  <i class="web_wechat_add"></i>
                </a>-->
              </h3>
              <!--<p class="signature" ng-bind-html="account.Signature" title="{{account.Signature|emojiHideFilter}}"></p>-->
            </div>
          </div>
          <!--END header-->

          <!--BEGIN search-->
          <div class="search_bar" id="search_bar">
            <i class="web_wechat_search"></i>
            <input
              class="frm_search"
              type="text"
              v-model="keyword"
              placeholder="Search"
            />
          </div>
          <!--END search-->

          <!--BEGIN tab-->
          <div class="tab" :class="{no_reader: !isShowReader}">
            <div class="tab_item" @click="changeTab('chat')">
              <a class="chat" title="聊天" href="#">
                <i
                  class="web_wechat_tab_chat"
                  :class="{web_wechat_tab_chat_hl: current.name === 'chat'}"
                ></i>
              </a>
            </div>
            <!-- ngIf: isShowReader -->
            <div class="tab_item" v-if="isShowReader">
              <a class="chat" title="阅读" href="#">
                <i
                  class="web_wechat_tab_public"
                  :class="{web_wechat_tab_public_hl: current.name === 'read'}"
                ></i>
              </a>
            </div>
            <!-- end ngIf: isShowReader -->
            <div class="tab_item no_extra" @click="changeTab('contacts')">
              <a class="chat" title="通讯录" href="#">
                <i
                  class="web_wechat_tab_friends"
                  :class="{web_wechat_tab_friends_hl: current.name === 'contacts'}"
                ></i>
              </a>
            </div>
          </div>
          <div class="download_entry" v-if="showDownloadEntry">
            <a href=" " class="opt">
                <i class="ChatListBanner_Close"></i>
            </a>
            <p class="msg">
               <a href="https://mac.weixin.qq.com?lang=en" target="_blank">Download WeChat for Mac</a>
            </p>
        </div>
          <div class="nav_view" v-show="!!keyword">
            <div class="chat_list" style="position:relative;">
              <chat-item v-for="contact in contactsByFilter" :contact="contact.payload" :key="contact.id" @item-click="onItemClick"></chat-item>
            </div>
          </div>
          <div class="nav_view" v-show="current.name === 'chat' && !!!keyword">
            <div class="chat_list" style="position:relative;">
              <chat-item :room="isRoomContact(contact.id)" v-for="contact in chatListInfos" :contact="contact" :key="contact.name" @item-click="onItemClick"></chat-item>
            </div>
          </div>
          <div class="nav_view" v-show="current.name === 'contacts' && !!!keyword">
            <div class="chat_list" style="position:relative;">
              <chat-item v-for="contact in contacts" :contact="contact.payload" :key="contact.id" @item-click="onItemClick"></chat-item>
              <infinite-loading @infinite="infiniteHandler"></infinite-loading>
            </div>
          </div>
        </div>
        <div style="height:100%">
          <div id="chatArea" class="box chat no-choose">
            <div class="box_hd">
              <div class="title_wrap">
                <div class="title poi">
                    <a class="title_name">{{currentContact.alias ? currentContact.alias : currentContact.name}}</a>
                    <!-- <span class="title_count">(59)</span> -->
                    <!-- <i class="web_wechat_down_icon"></i> -->
                </div>
            </div>
            </div>
            <div id="talk" class="box_bd chat_bd" style="position:absolute;">
              <div v-if="currentMessages.length === 0" class="message_empty">
                <i class="web_wechat_nomes_icon"></i>
                <p v-if="currentContact.name === ''" class="">No chats selected</p>
                <p v-else-if="currentMessages.length === 0" class="">No new messages</p>
              </div>
              <div v-else>
                <message-item :message="message" v-for="message in currentMessages" :key="message.timestamp"></message-item>
              </div>
            </div>
            <div class="box_ft">
                <div class="toolbar" id="tool_bar">
                    <!-- <a class="web_wechat_face" ng-click="showEmojiPanel($event)" href="javascript:;" title="Stickers"></a> -->
                    <!-- <a mm-action-track="" track-type="['click']" track-opt="{'target':'截图'}" class="web_wechat_screencut ng-isolate-scope" ng-hide="noflash" ng-click="screenShot()" href="javascript:;" title="Screenshot"></a> -->
                    <a class="web_wechat_pic js_fileupload webuploader-container" href="javascript:;" title="Image and File"><div class="webuploader-pick"></div>
                    <div id="rt_rt_1e2dondomgmj1btj154u1bt115md1" style="position: absolute; top: 0px; left: 0px; width: 30px; height: 30px; overflow: hidden; bottom: auto; right: auto;">
                      <!-- <input type="file" name="file" class="webuploader-element-invisible" multiple="multiple">
                      <label style="opacity: 0; width: 100%; height: 100%; display: block; cursor: pointer; background: rgb(255, 255, 255);"></label> -->
                      </div
                      ></a>
                </div>
                <div class="content">
                    <pre id="editArea" class="flex edit_area" contenteditable @keyup.enter="sendMessage"></pre>
                <div class="action">
                    <!-- <span class="desc">Press Cmd+Enter to start a new line</span> -->
                    <a class="btn btn_send" @click="sendMessage">Send</a>
                </div>
            </div>
            </div>
            <!-- <div class="catch-drop-area"></div> -->
          </div>
        </div>

        <!--BEGIN contextMenu-->
        <!-- <div
          id="contextMenu"
          class="dropdown contextMenu open ng-isolate-scope ng-hide"
          ng-show="isShowContextMenu"
          ng-style="contextStyle"
          context-menu-directive
        >
          <ul class="dropdown_menu">
          </ul>
        </div> -->
        <!--END contextMenu-->
      </div>
      <p class="copyright">
        <span>© wozaizhao</span>
      </p>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'
import chatItem from '../components/chat-item'
import messageItem from '../components/message-item'

// function notifyMe () {
//   if (!('Notification' in window)) {
//     alert('This browser does not support desktop notification')
//   } else if (Notification.permission === 'granted') {
//     // If it's okay let's create a notification
//     var notification = new Notification('Hi there!')
//   } else if (Notification.permission !== 'denied') {
//     Notification.requestPermission(function (permission) {
//       // 如果用户同意，就可以向他们发送通知
//       if (permission === 'granted') {
//         var notification = new Notification('Hi there!')
//       }
//     })
//   }
// }

export default {
  name: 'chat',
  components: {
    InfiniteLoading,
    chatItem,
    messageItem
  },
  data () {
    return {
      baseUrl: process.env.API,
      isLoaded: true,
      isUnLogin: true,
      showDownloadEntry: false,
      keyword: '',
      isShowReader: true,
      current: {
        name: 'chat'
      },
      isShowChatRoomMembers: false,
      currentContact: {
        name: ''
      },
      currentMessages: [],
      chatList: [],
      chatListInfos: [],
      chatMessages: {},
      contacts: [],
      allContacts: [],
      rooms: {}
    }
  },
  mounted () {
    // notifyMe()
    let self = this
    this.sockets.subscribe('message', (message) => {
      if (message.type === 7 || message.type === 6) {
        message.timestamp = new Date().getTime()
        let id = message.room ? message.room.id : message.self ? message.to.id : message.from.id
        if (!self.chatMessages[id]) {
          self.chatMessages[id] = []
        }
        self.chatMessages[id].push(message)
        self.addChatList(id)
      } else {
        console.log('not text or img message')
      }
    })
    this.sockets.subscribe('contacts', (contacts) => {
      self.allContacts = contacts
      // self.allContacts = contacts.filter(ele => { return ele.payload.type === 1 })
      self.contacts = self.allContacts.splice(0, 20)
      // this.$socket.emit('getavatar', {room: false, name: contacts[0].payload.name})
    })
  },
  computed: {
    ...mapState({
      account: state => state.user.account
    }),
    contactsByFilter () {
      return this.allContacts.filter(ele => ele.payload.name.indexOf(this.keyword) > -1 || ele.payload.alias.indexOf(this.keyword) > -1)
    }
  },
  watch: {
    currentMessages () {
      this.gotoEnd()
    }
  },
  methods: {
    infiniteHandler ($state) {
      if (this.allContacts.length) {
        let len = this.allContacts.length > 10 ? 10 : this.allContacts.length
        this.contacts.push(...this.allContacts.splice(0, len))
        $state.loaded()
      } else {
        $state.complete()
      }
    },
    gotoEnd () {
      this.$nextTick(() => {
        let container = this.$el.querySelector('#talk')
        container.scrollTop = container.scrollHeight
      })
    },
    htmlDecode (e) {
      return e && e.length !== 0 ? e.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&') : ''
    },
    clearHtmlStr (e) {
      return e ? e.replace(/<[^>]*>/g, '') : e
    },
    changeTab (tab) {
      this.current.name = tab
      if (tab === 'contacts' && this.allContacts.length === 0 && this.contacts.length === 0) {
        this.$socket.emit('getcontacts')
      }
    },
    sendMessage () {
      let message = document.getElementById('editArea').innerHTML
      message = this.clearHtmlStr(message)
      if (message) {
        let room = this.isRoomContact(this.currentContact.id)
        let name = this.currentContact.name
        let msg = {
          room,
          name,
          message
        }
        this.$socket.emit('sendmessage', msg)
        document.getElementById('editArea').innerHTML = ''
      }
    },
    onItemClick (contact) {
      this.currentContact = contact
      this.currentMessages = this.getChatMessage(contact.id) || []
    },
    sendTextMessage () {
    },
    addChatList (id) {
      let _chatList = this.chatList
      let idx = _chatList.indexOf(id)
      if (idx === -1) {
        _chatList.unshift(id)
      } else {
        let i = _chatList.splice(idx, 1)
        _chatList.unshift(i[0])
      }
      this.chatList = _chatList
      this.getChatList()
      // var t = this;
      // e && (angular.isArray(e) || (e = [e]),
      // angular.forEach(e, function(e, t) {
      //     var a = ""
      //       , n = 0;
      //     if (a = e.UserName ? e.UserName : e.FromUserName == accountFactory.getUserInfo().UserName ? e.ToUserName : e.FromUserName,
      //     n = _chatList.indexOf(a),
      //     n == -1)
      //         _chatList.unshift(a),
      //         utilFactory.isRoomContact(a) && contactFactory.addBatchgetChatroomContact(a);
      //     else {
      //         var i = _chatList.splice(n, 1);
      //         _chatList.unshift(i[0])
      //     }
      // }),
      // t.getChatList(),
      // $rootScope.$broadcast("chat:add:success"))
    },
    deleteChatList () {
      // var t = this;
      // e && (angular.isArray(e) || (e = [e]),
      // angular.forEach(e, function(e, t) {
      //     var a = _chatList.indexOf(e);
      //     a > -1 && _chatList.splice(a, 1)
      // }),
      // t.getChatList())
    },
    getChatList () {
      let _chatList = this.chatList
      let _chatListFull = []
      _chatList.forEach(chat => {
        let lastMsg = this._getLastMessage(chat)
        let room = lastMsg.room
        let name = room ? room.payload.topic : lastMsg.self ? lastMsg.to.payload.name : lastMsg.from.payload.name
        let avatar = room ? '' : lastMsg.self ? lastMsg.to.payload.avatar : lastMsg.from.payload.avatar
        let text = lastMsg.type === 7 ? lastMsg.text : lastMsg.type === 6 ? '[image]' : ''
        let alias = room ? '' : lastMsg.self ? lastMsg.to.payload.alias : lastMsg.from.payload.alias
        _chatListFull.push({
          id: chat,
          name,
          avatar,
          text,
          alias
        })
      })
      this.chatListInfos = _chatListFull
      // var e = this
      //   , t = [];
      // return _chatListInfos.length = 0,
      // angular.forEach(_chatList, function(a, n) {
      //     var i, o = contactFactory.getContact(a), r = {};
      //     if (o && !o.isBrandContact() && !o.isShieldUser()) {
      //         if (a == _currentUserName) {
      //             var c = e.getUnreadMsgsCount(a);
      //             (!o.unreadCount || o.unreadCount < c) && (o.unreadCount = e.getUnreadMsgsCount(a)),
      //             o._notActive || e.markMsgsRead(a) && e.notifyMobile(a, confFactory.StatusNotifyCode_READED)
      //         }
      //         i = e._getLastMessage(o.UserName),
      //         angular.extend(r, o, {
      //             MMDigest: i.MMDigest || "",
      //             NoticeCount: e.getUnreadMsgsCount(a),
      //             MMStatus: i.MMStatus,
      //             MMTime: i.MMTime || "",
      //             MMDigestTime: i.MMDigestTime || ""
      //         }),
      //         t.push(r)
      //     }
      // }),
      // [].push.apply(_chatListInfos, handleChatList(t)),
      // _chatListInfos
    },
    _getLastMessage (id) {
      let messages = this.getChatMessage(id)
      return messages && messages.length ? messages[messages.length - 1] : {}
      // var t = this
      //   , a = t.getChatMessage(e);
      // return a.length ? a[a.length - 1] : {}
    },
    addChatMessage (e) {
      // if (e) {
      //     var t = this
      //       , a = (e.FromUserName,
      //     e.ToUserName,
      //     _chatMessages[e.MMPeerUserName] || (_chatMessages[e.MMPeerUserName] = []));
      //     _addedMsgIdsMap[e.MsgId] || (_addedMsgIdsMap[e.MsgId] = !0,
      //     _msgMap[e.MsgId] = e,
      //     a.push(e),
      //     $rootScope.$broadcast("message:add:success", e),
      //     t.getChatList())
      // }
    },
    getMsg (e) {
      // return _msgMap[e]
    },
    deleteChatMessage (e) {
      // _chatMessages[e] = []
    },
    // showMessage: function(e, t, a) {
    //     if (e)
    //         t.DisplayName = e;
    //     else {
    //         var n = contactFactory.getContact(t.MMActualSender);
    //         n && n.DisplayName ? t.DisplayName = n.DisplayName : t.DisplayName = t.MMActualSender
    //     }
    // },
    // updateMessage: function(e, t, a) {
    //     angular.extend(e[t], a)
    // },
    getChatMessage (id) {
      let _chatMessages = this.chatMessages
      if (_chatMessages[id]) {
        return _chatMessages[id]
      }
      // var a = this;
      // return t && (_currentUserName = e,
      // a.markMsgsRead(e)),
      // _chatMessages[e] || (_chatMessages[e] = []),
      // _chatMessages[e]
    },
    cleanChatMessage (e) {
      // _chatMessages[e] && _chatMessages[e].splice(0, _chatMessages[e].length)
    },
    // getChatMessageBySlice: function(e, t, a) {
    //     var n = this;
    //     return _currentUserName = e,
    //     n.clearChatNoticeCount(),
    //     _chatMessages[e] ? _chatMessages[e].slice(t, a) : []
    // },
    // setCurrentUnread: function(e, t) {
    //     _currentUnreadMap[e] = t
    // },
    getUnreadMsgsCount (e) {
      // var t, a = 0;
      // if (_currentUnreadMap[e])
      //     return _currentUnreadMap[e];
      // if (t = _chatMessages[e])
      //     for (var n = t.length - 1; n >= 0; n--)
      //         t[n].MMUnread && ++a;
      // return a
    },
    isRoomContact (id) {
      return !!id && /^@@|@chatroom$/.test(id)
    }
    // markMsgsRead: function(e) {
    //     for (var t = this.getChatMessage(e), a = !1, n = 0, i = t.length; n < i; n++)
    //         t[n].MMUnread && (a = !0),
    //         t[n].MMUnread = !1;
    //     return this.setCurrentUnread(e, 0),
    //     a
    // },
  },
  destroyed () {
    // this.$socket.emit('logout')
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
      this.$socket.emit('checklogin')
    },
    // message: function (message) {
    //   console.log('message', message)
    //   if (message.type === 7) {
    //     let id = message.room ? message.room.id : message.from.id
    //     this.chatMessages[id].push(message)
    //   } else {
    //     console.log('not text message')
    //   }
    // },
    login: function (res) {
      if (res) {
        this.$store.dispatch('login', res.payload)
      } else {
        this.$router.push('/?from=chat')
      }
    }
  }
}
</script>

<style>
.chat{
  height: 100%;
}
</style>
