require('dotenv').config();
import {Sequelize} from 'sequelize';

/*
 * La classe Singleton è quella che ci permette di avere un'unica
 * connessione al DB, ovvero una sola istanza di tale oggetto.
 */

export class Singleton{
    private static istanza: Singleton;
    private connessione: Sequelize;

    private constructor(){
        this.connessione = new Sequelize(process.env.MYSQL_DATABASE,  process.env.MYSQL_USER, process.env.MYSQL_PASSWORD,{
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