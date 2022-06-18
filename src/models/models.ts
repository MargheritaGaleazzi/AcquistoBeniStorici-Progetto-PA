import { Singleton } from "../connessione";
import { DataTypes, Sequelize } from 'sequelize';

//Ci si connette al database
const sequelize: Sequelize = Singleton.getConnessione();
/*const fs = require('fs');
const seedQuery = fs.readFileSync("seeder/seed.sql",{
    encoding:"utf-8",
})
console.log("è in corso il seeding del database");
sequelize.query(seedQuery);
console.log("seeding completato")
*/

/*
 * Di seguito vi è l'ORM, che altro non è che il pattern che
 * ci consentirà di interagire con il database.
 * Viene utilizzata, come esplicitamente richiesto, la libreria
 * Sequelize.
 */


export const Modo = sequelize.define('modo',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    id_acquisto:{
        type:DataTypes.INTEGER,
        allowNull: false
    },
    id_bene:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    tipo_acq:{
        type:DataTypes.ENUM("download originale", "download aggiuntivo"),
        defaultValue: "download originale"
    }
},
{
    modelName: 'modo',
    timestamps:false,
    freezeTableName:true
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
    },
    tipo:{
        type: DataTypes.ENUM('manoscritto','cartografia storica'),
        allowNull: false
    },
    anno:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    prezzo:{ 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nDownload:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    modelName: 'bene',
    timestamps: false,
    freezeTableName: true
});
Bene.hasMany(Modo);
Modo.belongsTo(Bene, {
    foreignKey: {
      field: 'id_bene'
    },
    as:'id_bene'
  });

//modella l'acquisto
export const Acquisto = sequelize.define('acquisto',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    formato:{
        type: DataTypes.ENUM("jpg","tiff","png"),
        allowNull: false
    },
    email_compr:{
        type:DataTypes.STRING(35),
        allowNull: false
    }
},
{
    modelName: 'acquisto',
    timestamps: false,
    freezeTableName: true
});

Acquisto.hasMany(Modo);
Modo.belongsTo(Acquisto, {
    foreignKey: {
      field: 'id_acquisto'
    },
    as: 'id_acquisto'
  });

//Modella l'utente
export const Utente = sequelize.define('utente',{
    email: {
        type: DataTypes.STRING(35),
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
Utente.hasMany(Acquisto,{
    foreignKey: {
      field:'email_compr',
    },
    as:'email_compr'
  });
Acquisto.belongsTo(Utente);
