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
        this.connessione = new Sequelize(process.env.DATABASE, process.env.USER_DB, process.env.PASSWORD_DB,{
            host: process.env.HOST_DB,
            port: Number(process.env.PORT_DB),
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