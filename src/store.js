import Vue from 'vue';
import Vuex from 'vuex';
import Eos from 'eosjs';
import { getTokenPrice, getMyBalancesByContract, getSupply, getMBalance } from './blockchain';
import { network } from './config';


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    scatter: null,
    identity: null,
    eos: null,
    balance: {
      eos: '0.0000 EOS',
      kby: '0.0000 KBY',
    },
    tokenPrice: '0.0000 EOS',
    supply: '0.0000 KBY',
    mbalance: '0.0000 EOS',
  },
  getters: {
    account: ({ scatter }) => {
      if (!scatter) { return null; }
      const { identity } = scatter;
      return identity ? identity.accounts.find(({ blockchain }) => blockchain === 'eos') : null;
    },
  },
  mutations: {
    setScatter(state, scatter) {
      state.scatter = scatter;
      state.eos = scatter.eos(network, Eos, {});
      state.identity = scatter.identity;
    },
    setIdentity(state, identity) {
      state.identity = identity;
    },
    setTokenPrice(state, price) {
      state.tokenPrice = `${price} EOS`;
    },
    setSupply(state, supply) {
      state.supply = `${supply} KBY`;
    },
    setMBalance(state, mbalance) {
      state.mbalance = `${mbalance} EOS` ;
    },    
    setBalance(state, { symbol, balance }) {
      state.balance[symbol] = balance || `0.0000 ${symbol.toUpperCase()}`;
    },
  },
  actions: {
    initScatter({ commit, dispatch }, scatter) {
      commit('setScatter', scatter);
      dispatch('updatePrice');
      dispatch('updateSupply');
      dispatch('updateMBalance');
    },
    async updatePrice({ commit }) {
      const price = await getTokenPrice();
      commit('setTokenPrice', price);
    },
    async updateBalance({ commit }) {
      const Balance = await getBalance();
      commit('setBalance', Balance);
    },
    async updateSupply({ commit }) {
        const supply = await getSupply();
        commit('setSupply', supply);
    },
    async updateMBalance({ commit }) {
      const mbalance = await getMBalance();
      commit('setMBalance', mbalance);
  },
    updateBalance({ commit }) {
      getMyBalancesByContract({ symbol: 'eos' })
        .then((price) => {
          commit('setBalance', { symbol: 'eos', balance: price[0] });
        });
      getMyBalancesByContract({ symbol: 'kby', tokenContract: 'dacincubator' })
        .then((price) => {
          commit('setBalance', { symbol: 'kby', balance: price[0] });
        });
    },
    setIdentity({ commit, dispatch }, identity) {
      commit('setIdentity', identity);
      dispatch('updateBalance');
    },
  },
});
