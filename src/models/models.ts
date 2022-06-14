import { Singleton } from "../Singleton";
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
    }
},
{
    modelName: 'utente',
    timestamps: false,
    freezeTableName: true
});

//Modella la ricetta
export const Ricetta = sequelize.define('ricetta', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING(20),
        allowNull:false
    },
    alimenti:{
        type: DataTypes.ARRAY(DataTypes.STRING(20)),
        allowNull:false
    },
    ordEsec:{
        type: DataTypes.ARRAY(DataTypes.STRING(20)),
        allowNull:false
    },
    quant:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull:false
    },
},
{
    modelName: 'ricetta',
    timestamps: false,
    freezeTableName: true
});

//Modella l'ordine
export const Ordine = sequelize.define('ordine', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    utente:{
        type: DataTypes.STRING(25),
        allowNull:false
    },
    quantTot:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull:false
    },
    stato:{
        type: DataTypes.ENUM("creato","fallito","in esecuzione","completato"),
        defaultValue: "in attesa",
    },
},
{
    modelName: 'ordine',
    timestamps: false,
    freezeTableName: true
});
//mette in relazione l'ordine con una ricetta
Ordine.hasOne(Ricetta);

//modella il magazzino
export const Magazzino = sequelize.define('magazzino', {
    alimento:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    disponibilita:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
},
{
    modelName: 'magazzino',
    timestamps: false,
    freezeTableName: true
});