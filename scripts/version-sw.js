#!/usr/bin/env node
/**
 * Stamps the Service Worker with a unique build version.
 * Runs as prebuild — every deploy gets a new cache name,
 * forcing the SW to activate and clear old cached assets.
 */
const fs = require("fs");
const path = require("path");

const SW_PATH = path.join(__dirname, "..", "public", "sw.js");
const version = `maisfortes-${Date.now()}`;

let sw = fs.readFileSync(SW_PATH, "utf8");
sw = sw.replace(/const CACHE_NAME = ".*?"/, `const CACHE_NAME = "${version}"`);
fs.writeFileSync(SW_PATH, sw);

console.log(`[version-sw] Cache version: ${version}`);
