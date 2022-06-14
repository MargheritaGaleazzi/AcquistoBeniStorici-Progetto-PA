import { Singleton } from "../singleton";
import { DataTypes, Sequelize } from 'sequelize';

//Ci si connette al database
const sequelize: Sequelize = Singleton.getConnessione();

/*
 * Di seguito vi è l'ORM, che altro non è che il pattern che
 * ci consentirà di interagire con il database.
 * Viene utilizzata, come esplicitamente richiesto, la libreria
 * Sequelize.
 */

//Modella l'utente
export const Utente = sequelize.define('utente',{
    email: {
        type: DataTypes.STRING(25),
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    nome:{
        type: DataTypes.STRING(25),
        allowNull: false
    },
    cognome: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    ruolo: {
        type: DataTypes.ENUM("user","admin"),
        defaultValue: "user",
    },
    tokenJWT: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    credito: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    modelName: 'utente',
    timestamps: false,
    freezeTableName: true
});

//Modella il bene
export const Bene = sequelize.define('bene', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING(20),
        allowNull:false
    }
},
{
    modelName: 'bene',
    timestamps: false,
    freezeTableName: true
});

//modella l'acquisto
export const Acquisto = sequelize.define('acquisto',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
},
{
    modelName: 'acquisto',
    timestamps: true,
    freezeTableName: true
});

Acquisto.hasMany(Bene);
Acquisto.hasOne(Utente);