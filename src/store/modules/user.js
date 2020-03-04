const user = {
  state: {
    account: {
      name: 'xchao'
    }
  },
  mutations: {
    SET_ACCOUNT: (state, account) => {
      state.account = account
    }
  },
  actions: {
    login ({ commit }, user) {
      commit('SET_ACCOUNT', user)
    }
  }
}

export default user
