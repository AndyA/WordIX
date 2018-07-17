"use strict";

module.exports = exports = {
  webroot: "public",
  less: "webapp/app/**/*.less",
  less_libs: [
    "webapp/lib/less",
    "node_modules/bootstrap/less",
    "node_modules/x-editable/dist/bootstrap3-editable/css",
    "node_modules/video.js/dist"
  ],
  js: "webapp/app/**/*.{js,jsx}",
  js_libs: ["webapp/lib/js", "build/js"],
  test: "test/**/*.js"
}

