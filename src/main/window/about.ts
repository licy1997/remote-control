// const openAboutWindow = require('about-window').default
import path from 'path'
import openAboutWindow from 'about-window'
export const create = () => openAboutWindow({
  icon_path: path.join(__dirname, 'icon.png'),
  package_json_dir: path.resolve(__dirname, '/../../../'),
  copyright: 'Copyright (c) 2021 laoli',
  homepage: ''
})

