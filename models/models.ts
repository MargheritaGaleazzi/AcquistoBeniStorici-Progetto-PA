import { Singleton } from "../connessione";
import { DataTypes, Sequelize } from 'sequelize';

//Ci si connette al database
const sequelize: Sequelize = Singleton.getConnessione();


/*
 * Di seguito vi è l'ORM, che altro non è che il pattern che
 * ci consentirà di interagire con il database.
 * Viene utilizzata, come esplicitamente richiesto, la libreria
 * Sequelize.
 */

/** Modella l'acquisto.
  * @typedef {Object} Acquisto
  * @property {number} id           - L'id dell'acquisto
  * @property {string} formato      - Il formato nel quale si vuole la foto acquistata
  * @property {string} email_compr  - L'email dell'utente che ha effettuato l'acquisto
  * @property {number} beneId       - L'id del bene acquistato
  * @property {string} tipo_acq     - Il tipo dell'acquisto
  * @property {number} nDownload    - Il numero di download effettuati
 */

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
    },
    beneId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    tipo_acq:{
        type:DataTypes.ENUM("download originale", "download aggiuntivo"),
        defaultValue: "download originale"
    },
    nDownload:{
        type:DataTypes.INTEGER,
        allowNull: false
    }
},
{
    modelName: 'acquisto',
    timestamps: false,
    freezeTableName: true
});

/** Modella il bene.
  * @typedef {Object} Bene
  * @property {number} id      - L'id del bene
  * @property {string} nome    - Il nome del bene
  * @property {string} tipo    - La categoria nella quale rientra il bene
  * @property {number} anno    - L'anno del bene
  * @property {number} prezzo  - Il costo del bene
 */
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
},
{
    modelName: 'bene',
    timestamps: false,
    freezeTableName: true
});
Bene.hasMany(Acquisto, {
    foreignKey: {
        field:'beneId',
      }
  });
Acquisto.belongsTo(Bene);

/** Modella l'utente.
  * @typedef {Object} Utente
  * @property {string} email     - L'email dell'utente
  * @property {string} username  - Lo username dell'utente
  * @property {string} nome      - Il nome dell'utente
  * @property {string} cognome   - Il cognome dell'utente
  * @property {string} ruolo     - Il ruolo dell'utente (user/admin)
  * @property {number} credito   - Il credito a disposizione dell'utente
 */
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