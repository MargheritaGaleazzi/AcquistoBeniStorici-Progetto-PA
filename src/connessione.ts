require('dotenv').config();
import {Sequelize} from 'sequelize';

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
        this.connessione = new Sequelize(this.MYSQL_DATABASE,  'admin', 'root',{
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