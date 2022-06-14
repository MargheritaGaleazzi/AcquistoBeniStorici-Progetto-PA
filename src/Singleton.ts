require('dotenv').config();
import {Sequelize} from 'sequelize';

export class Singleton{
    private static istanza: Singleton;
    private connessione: Sequelize;

    private constructor(){
        this.connessione = new Sequelize()
    }

    public static getConnessione(): Sequelize {
        if (!Singleton.istanza) {
            this.istanza = new Singleton();
        }
        return Singleton.istanza.connessione;    

    }
}