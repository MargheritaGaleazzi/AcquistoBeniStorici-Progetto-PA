"use strict";
exports.__esModule = true;
exports.Singleton = void 0;
require('dotenv').config();
var sequelize_1 = require("sequelize");
/*
 * La classe Singleton è quella che ci permette di avere un'unica
 * connessione al DB, ovvero una sola istanza di tale oggetto.
 */
var Singleton = /** @class */ (function () {
    function Singleton() {
        this.connessione = new sequelize_1.Sequelize(process.env.DATABASE, process.env.USER_DB, process.env.PASSWORD_DB, {
            host: process.env.HOST_DB,
            port: Number(process.env.PORT_DB),
            dialect: 'mysql'
        });
    }
    Singleton.getConnessione = function () {
        if (!Singleton.istanza) {
            this.istanza = new Singleton();
        }
        return Singleton.istanza.connessione;
    };
    return Singleton;
}());
exports.Singleton = Singleton;
