const config = require("../config");
const cors = require('cors');

const ALLOWED_ORIGINS = config.cors.whiteList.local;

module.exports = cors({ origin: ALLOWED_ORIGINS });
