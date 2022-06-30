import { OAuth } from 'oauthio-web';
import Parse from 'parse'
import { event } from 'vue-analytics'

import router from '../../../router'

import {
  logIn,
  logOut,
  createUser,
  getUserByEmail,
} from '../../../utils/authentication';

import {
  ColorPalette,
  Chart
} from '../../../models'

import {
  getStringHash
} from '../../../utils';

import defaultColorPalettes from '../../../constants/defaults/defaultColorPalettes'

// actions
const actions = {

  async checkLoggedIn ({ dispatch }) {

    let user = await Parse.User.current()

    if(user !== null) {
      user = await dispatch('getFullUser', user)
    }

    return user

  },

  async getFullUser({ commit }, user) {

    let currentUser = user

    if(!currentUser) {
      currentUser = await Parse.User.current()
    }

    const colorPalettes = await ColorPalette.get()
    const charts = await Chart.get()

    commit('setColorPalettes', colorPalettes)
    commit('setCharts', charts)
    commit('setUser', currentUser)

    return currentUser
  },

  async getAllCharts({ commit }) {

    const charts = await Chart.get()
    commit('setCharts', charts)

  },

  login ({ commit, dispatch }, { email, password }) {

    commit('setLoginStatus', 'submitting')

    logIn(email, password)
      .then(user => {
        router.push('/home')
        commit('setLoginStatus', true)
        commit('setUser', user)
        commit('clearLoginError')
        dispatch('getFullUser', user)
        event({
          eventCategory: 'login',
          eventAction: 'login',
          eventLabel: 'success',
          eventValue: 1
        })
      })
      .catch((err) => {
        const errorMessage = err.message
        commit('setLoginError', errorMessage)
        commit('setLoginStatus', false)
        event({
          eventCategory: 'login',
          eventAction: 'login',
          eventLabel: 'failure',
          eventValue: 1
        })
      })

  },

  signup ({ dispatch, commit }, { email, password, fullName }) {

    commit('setLoginStatus', 'submitting')

    createUser(email, password, fullName)
      .then(user => {
        commit('setLoginStatus', true)
        commit('setUser', user)
        commit('clearLoginError')
        dispatch('initUser')
        router.push('/home')
        event({
          eventCategory: 'signup',
          eventAction: 'signup',
          eventLabel: 'success',
          eventValue: 1
        })
      })
      .catch((err) => {
        const errorMessage = err.message
        commit('setLoginError', errorMessage)
        commit('setLoginStatus', false)
        event({
          eventCategory: 'signup',
          eventAction: 'signup',
          eventLabel: 'failure',
          eventValue: 1
        })
      })

  },

  resetPassword({ commit }, { email }) {
    commit('setLoginStatus', 'submitting')

    const p = new Promise((resolve, reject) => {

      Parse.User.requestPasswordReset(email)
        .then(() => {
          commit('clearLoginError')
          event({
            eventCategory: 'user',
            eventAction: 'resetpass',
            eventLabel: 'success',
            eventValue: 1
          })

          resolve()
        })
        .catch((err) => {
          const errorMessage = err.message
          commit('setLoginError', errorMessage)
          event({
            eventCategory: 'user',
            eventAction: 'resetpass',
            eventLabel: 'failure',
            eventValue: 1
          })
          reject(err)
        })

    })

    return p
  },

  googleSignin ({ commit }) {

    commit('setLoginStatus', 'submitting')

    // TODO: make this work on the server
    // how to: http://docs.parseplatform.org/parse-server/guide/#oauth-and-3rd-party-authentication
    // oauth library: https://www.npmjs.com/package/vue-google-oauth2
    this.$gAuth
        .signIn()
        .then(GoogleUser => {
          getUserByEmail(GoogleUser.w3.U3).then(users => {
            if (users.length) {
              logIn(users[0].username, getStringHash(users[0].username))
                .then(() => this.$router.push('/home'))
                .catch(this.onError)
                // .then(() => (this.submitting = false));
            } else if (GoogleUser) {
                // this.submitting = true;
                createUser(undefined, undefined, undefined, GoogleUser)
                  .then(user => {
                    router.push('/home')
                    commit('setLoginStatus', true)
                    commit('setUser', user)
                    commit('clearLoginError')
                  })
                  .catch((err) => {
                    const errorMessage = err.message
                    commit('setLoginError', errorMessage)
                    commit('setLoginStatus', false)
                  })

              }
          });
        })
        .catch(err => {
          const errorMessage = err.message
          commit('setLoginError', errorMessage)
          commit('setLoginStatus', false)
        });

  },

  twitterSignin  ({ commit }, twitterData) {
    // TODO: remove the line below (it's a placeholder)
    const config = twitterData // REMOVE THIS LINE!!!
    // Initialize with your OAuth.io app public key
    OAuth.initialize(config.twitter_ID);
    // Use popup for OAuth
    OAuth.popup('twitter').then(twitter => {
      // eslint-disable-next-line
      console.log('twitter:', twitter);
      // Prompts 'welcome' message with User's email on successful login
      // #me() is a convenient method to retrieve user data without requiring you
      // to know which OAuth provider url to call
      twitter.me().then(data => {
        // eslint-disable-next-line
        console.log('data:', data);
        // eslint-disable-next-line
        alert(
          `Twitter says your email is:${
            data.email
            }.\nView browser 'Console Log' for more details`,
        );
      });
      // Retrieves user data from OAuth provider by using #get() and
      // OAuth provider url
      twitter.get('/1.1/account/verify_credentials.json?include_email=true').then(data => {
        // eslint-disable-next-line
        console.log('self data:', data);
        commit('loginWithTwitter')
      });
    });

  },

  logout ({ commit }) {
    // firebase.auth().signOut().then(() => {
    //   commit('signout')
    //   router.replace('/')
    // })
    logOut()
      .catch(err => {
        // eslint-disable-next-line
        console.error('logout error', err)
        event({
          eventCategory: 'logout',
          eventAction: 'logout',
          eventLabel: 'failure',
          eventValue: 1
        })
      })
      .then(() => {
        commit('signout')
        event({
          eventCategory: 'logout',
          eventAction: 'logout',
          eventLabel: 'success',
          eventValue: 1
        })
        window.location.reload()
      });
  },

  // eslint-disable-next-line
  changePassword ({ commit }, newPassword) {

  },

  // eslint-disable-next-line
  changeName ({ commit }, newName) {

  },

  // eslint-disable-next-line
  changeEmail ({ commit }, newEmail) {

  },

  // eslint-disable-next-line
  verifyEmail ({ commit }) {

  },

  // Only used as a pass-through on the signup page right now
  setErrorMessage ({ commit }, errorMessage) {
    commit( 'setLoginError', errorMessage )
  },

  initUser ({ commit }) {

    const p = []

    defaultColorPalettes.reverse().forEach((c) => {
      p.push(ColorPalette.create(c))
    })

    Promise.all(p).then(async () => {
      const colorPalettes = await ColorPalette.get()
      commit('setColorPalettes', colorPalettes)
    })

  },

  deleteColorPalette ({ commit }, { objectId, index }) {

    ColorPalette.delete(objectId)
      .then(() => {
        commit('removeColorPalette', index)
      })
      .catch(err => commit('setColorPaletteError', err))

  },

  createColorPalette ({ commit }, obj) {

    ColorPalette.create(obj)
      .then(() => {
        ColorPalette.get().then(colorPalettes => {
          commit('setColorPalettes', colorPalettes)
        })
        event({
          eventCategory: 'colorPalette',
          eventAction: 'create',
          eventLabel: 'success',
          eventValue: obj.colors.length
        })
      })
      .catch(err => commit('setColorPaletteError', err))

  },

  updateColorPalette ({ commit }, obj) {

    ColorPalette.update(obj.id, obj)
      .then(() => {
        ColorPalette.get().then(colorPalettes => {
          commit('setColorPalettes', colorPalettes)
        })

        event({
          eventCategory: 'colorPalette',
          eventAction: 'update',
          eventLabel: 'success',
          eventValue: obj.colors.length
        })
      })
      .catch(err => commit('setColorPaletteError', err.message))

  },

  deleteChart ({ commit }, obj) {

    Chart.delete(obj.objectId)
      .then(() => {
        commit('removeChart', obj.index)
        event({
          eventCategory: 'chart',
          eventAction: 'delete',
          eventLabel: 'success',
          eventValue: 1
        })
      })
      .catch(err => commit('setChartError', err))

  },

  updateChart ({ commit }, { chart, index, keys }) {

    Chart.update(chart.objectId, {
      chart: { ...chart, ...keys }
    })
      .then(() => {
        commit('updateChart', { index, keys })
        event({
          eventCategory: 'chart',
          eventAction: 'update',
          eventLabel: 'success',
          eventValue: 1
        })
      })
      .catch(err => {
        // eslint-disable-next-line
        console.error(err)
        commit('setChartError', err)
      })

  }

}

export default actions
