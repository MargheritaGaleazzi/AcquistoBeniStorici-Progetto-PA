import { Singleton } from "../Singleton";
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = Singleton.getConnessione;

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
        type: DataTypes.STRING(5),
        allowNull: false
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
    ricetta:{
        // completare chave esterna
    },
    quantTot:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull:false
    },
    stato:{
        //aggiungere lo stato
    },
},
{
    modelName: 'ordine',
    timestamps: false,
    freezeTableName: true
});

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