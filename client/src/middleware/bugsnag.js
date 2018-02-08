import bugsnag from 'bugsnag-js'
import bugsnagVue from 'bugsnag-vue'
import Vue from 'vue'

const bugsnagClient = bugsnag(process.env.BUGSNAG)
bugsnagClient.use(bugsnagVue(Vue))
