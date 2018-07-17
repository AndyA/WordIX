"use strict";

var express = require("express");
var bodyParser = require("body-parser");

// Handlebars helpers
require("../webapp/lib/js/srv/hb-helpers/config.js");

var WEBROOT = "www";
var app = express();

app.use(bodyParser.json());

app.use(require("../webapp/lib/js/srv/views.js"));
app.use(require("../webapp/lib/js/srv/data.js"));
app.use(require("../webapp/lib/js/srv/hls-live-manifest.js"));

app.use(express.static(WEBROOT));

app.listen(31729);
