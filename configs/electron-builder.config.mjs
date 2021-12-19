
/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  appId: "1115291516@qq.com",
  productName: "laoli",
  asar: false,
  directories: {
    output: "release/${version}",
    "buildResources": "resources"
  },
  files: [
    "!node_modules",
    "dist",
    "package.json"
  ],
  mac: {
    artifactName: "${productName}_${version}.${ext}",
    target: [
      "dmg", "zip"
    ]
  },
  win: {
    target: [
      "nsis", "squirrel"
    ],
    artifactName: "${productName}_${version}.${ext}"
  },
  nsis: {
    oneClick: false,
    perMachine: true,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false
  }
}

export { config }
