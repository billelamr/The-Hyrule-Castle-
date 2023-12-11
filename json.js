"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Boss = exports.Enemies = exports.MyPlayer = void 0;
var fs = require('fs');
function MyPlayer() {
    try {
        var file = fs.readFileSync('./players.json', 'utf-8');
        var PlayerJson = JSON.parse(file);
        return PlayerJson;
    }
    catch (_a) {
        console.error('Cannot access to players.json');
    }
}
exports.MyPlayer = MyPlayer;
function Enemies() {
    try {
        var file = fs.readFileSync('./enemies.json', 'utf-8');
        var enemiesJson = JSON.parse(file);
        return enemiesJson;
    }
    catch (_a) {
        console.error('Cannot access to enemies.json');
    }
}
exports.Enemies = Enemies;
function Boss() {
    try {
        var file = fs.readFileSync('./bosses.json', 'utf-8');
        var bossJson = JSON.parse(file);
        return bossJson;
    }
    catch (_a) {
        console.error('Cannot access to boss.json');
    }
}
exports.Boss = Boss;
