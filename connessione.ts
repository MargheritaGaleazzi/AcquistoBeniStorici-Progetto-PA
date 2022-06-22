require('dotenv').config();
import {Sequelize} from 'sequelize';

/*
 * La classe Singleton è quella che ci permette di avere un'unica
 * connessione al DB, ovvero una sola istanza di tale oggetto.
 */

const fs = require('fs');
const mysql = require("mysql2");

// Open the connection to MySQL server
const connection = mysql.createConnection({
  multipleStatements: true,
  host: "gestione_acquisto_beni",
  user: "user",
  password: "password",
});

// Run create database statement
connection.query(
  `CREATE DATABASE IF NOT EXISTS gestione_acquisto_beni`,
  function (err:any, results:any) {
    console.log(results);
    console.log(err);
  }
);

//connection.end();

export class Singleton{
    private static istanza: Singleton;
    private connessione: Sequelize;
    //private MYSQL_DATABASE = "gestione_acquisto_beni"
    //private MYSQL_HOST="localhost"
    //private MYSQL_PORT=3306

    /*
      private constructor(){
        this.connessione = new Sequelize(this.MYSQL_DATABASE,  'root', '',{
            host: this.MYSQL_HOST,
            port: this.MYSQL_PORT,
            dialect: 'mysql'
        });
      }
    */  

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