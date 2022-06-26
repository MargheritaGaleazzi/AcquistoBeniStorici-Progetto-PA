require('dotenv').config();
import {Sequelize} from 'sequelize';

/*
 * La classe Singleton è quella che ci permette di avere un'unica
 * connessione al DB, ovvero una sola istanza di tale oggetto.
 */

const fs = require('fs');
const mysql = require("mysql2");

// Inizia la connessione al server MySQL
const connection = mysql.createConnection({
  multipleStatements: true,
  host: "gestione_acquisto_beni",
  user: "user",
  password: "password",
});

// Esegue la creazione del database
connection.query(
  `CREATE DATABASE IF NOT EXISTS gestione_acquisto_beni`,
  function (err:any, results:any) {
    console.log(results);
    console.log(err);
  }
);

export class Singleton{
    private static istanza: Singleton;
    private connessione: Sequelize;

    private constructor(){
      this.connessione = new Sequelize(process.env.MYSQL_DATABASE!, process.env.MYSQL_USER!, process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        dialect: 'mysql'
      });
    }

    public static getConnessione(): Sequelize {
        if (!Singleton.istanza) {
            this.istanza = new Singleton();
        }
        return Singleton.istanza.connessione;    
    }
}