const electron = require("electron");
const fs = require("fs");
const path = require("path");

// functions 
const parseDataFile = (filePath, defaults) => {
  try {
    return JSON.parse(fs.readFileSync(filePath))
  } catch (error) {
    return defaults;
  }
}

// class
class Settings {
  constructor(opts) {
    const userDataPath = this.getSettingPath();
    this.path = path.join(userDataPath, opts.configName + ".json");
    this.data = parseDataFile(this.path, opts.defaults);
  }

  getSettingPath = () =>
    (electron.app || electron.remote.app).getPath("userData");

  get = (key) => this.data[key];

  set = (key, val) => {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}


module.exports = Settings;


