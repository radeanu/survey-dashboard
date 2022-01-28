import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#018053',
        primary5: '#97d7c0',
        primary6: '#d2eae1',
        primary2: '#04a76d',
        accent: '#ff0000',
        accent1: 'ff4343',
        accent2: '#c00000',
        accent5: '#ffa4a4',
        error: '#b71c1c',
        tableheaderfill: '#018053',
        tableheadercolor: '#ffffff',
        descriptioncolor: '#000000',
        descriptionheadercolor: '#0078ff',
        textcolor: '#313131',
        actioncolor: '#00839c',
        texttitle: '#00839c',
        rowinvalid: '#f99a9a',
        rowvalid: '#95cdb9',
        rowprocessing: '#dacc9c'
      },
      dark: {
        primary: '#607D8B',
        primary5: '#97d7c0',
        primary6: '#d2eae1',
        primary2: '#04a76d',
        accent: '#a65252',
        accent5: '#ffa4a4',
        accent1: 'ff4343',
        accent2: '#c00000',
        error: '#b71c1c',
        tableheaderfill: '#272727',
        tableheadercolor: '#018053',
        descriptioncolor: '#525252',
        descriptionheadercolor: '#018053',
        textcolor: '#a0a0a0',
        actioncolor: '#00839c',
        texttitle: '#00839c',
        rowinvalid: '#f99a9a',
        rowvalid: '#95cdb9',
        rowprocessing: '#dacc9c'
      },
      options: {
        customProperties: true
      }
    },
    options: {
      customProperties: true
    }
  },
  icons: {
    iconfont: 'mdi',
  },
});
