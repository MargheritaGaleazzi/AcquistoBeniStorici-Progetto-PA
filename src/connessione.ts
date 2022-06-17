require('dotenv').config();
import {Sequelize} from 'sequelize';


const mysql = require("mysql2");

// Open the connection to MySQL server
const connection = mysql.createConnection({
  multipleStatements: true,
  host: "localhost",
  user: "root",
  password: "",
});

// Run create database statement
connection.query(
  `CREATE DATABASE IF NOT EXISTS gestione_acquisto_beni`,
  function (err:any, results:any) {
    console.log(results);
    console.log(err);
  }
);

// Close the connection
connection.end();
/*
 * La classe Singleton è quella che ci permette di avere un'unica
 * connessione al DB, ovvero una sola istanza di tale oggetto.
 */


export class Singleton{
    private static istanza: Singleton;
    private connessione: Sequelize;
    private MYSQL_DATABASE = "gestione_acquisto_beni"
    private MYSQL_ROOT_PASSWORD="root"
    private MYSQL_USER="user"
    private MYSQL_PASSWORD="password"
    private MYSQL_HOST="localhost"
    private MYSQL_PORT=3306


    private constructor(){
        this.connessione = new Sequelize(this.MYSQL_DATABASE,  'root', '',{
            host: this.MYSQL_HOST,
            port: this.MYSQL_PORT,
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