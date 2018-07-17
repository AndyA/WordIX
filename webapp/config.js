"use strict";

const os = require("os");
const merge = require('merge-deep');

function getConfig() {
  const defaultConfig = {
    bs: {
      proxy: "http://clp.bbcgenome.com"
    }
  };

  const perHostConfig = {
    hattie: {
      bs: {
        proxy: "http://clp.pike"
      }
    },
    trout: {
      bs: {
        proxy: "http://clp2.pike"
      }
    }
  };

  const host = os.hostname();
  if (perHostConfig.hasOwnProperty(host))
    return merge(defaultConfig, perHostConfig[host]);
  return defaultConfig;
}

module.exports = exports = getConfig();

