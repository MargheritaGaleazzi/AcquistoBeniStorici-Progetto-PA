"use strict";
exports.__esModule = true;
exports.Utente = exports.Acquisto = exports.Bene = exports.Modo = void 0;
var singleton_1 = require("../singleton");
var sequelize_1 = require("sequelize");
//Ci si connette al database
var sequelize = singleton_1.Singleton.getConnessione();
/*
 * Di seguito vi è l'ORM, che altro non è che il pattern che
 * ci consentirà di interagire con il database.
 * Viene utilizzata, come esplicitamente richiesto, la libreria
 * Sequelize.
 */
exports.Modo = sequelize.define('modo', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_acquisto: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    id_bene: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    tipo_acq: {
        type: sequelize_1.DataTypes.ENUM("download originale", "download aggiuntivo"),
        defaultValue: "download originale"
    }
}, {
    modelName: 'modo',
    timestamps: true,
    freezeTableName: true
});
//Modella il bene
exports.Bene = sequelize.define('bene', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    tipo: {
        type: sequelize_1.DataTypes.ENUM('manoscritto', 'cartografia storica'),
        allowNull: false
    },
    anno: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    prezzo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    nDownload: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    modelName: 'bene',
    timestamps: false,
    freezeTableName: true
});
exports.Bene.hasMany(exports.Modo);
exports.Modo.belongsTo(exports.Bene, {
    foreignKey: {
        name: 'id_bene'
    }
});
//modella l'acquisto
exports.Acquisto = sequelize.define('acquisto', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    formato: {
        type: sequelize_1.DataTypes.ENUM("jpg", "tiff", "png"),
        allowNull: false
    },
    email_compr: {
        type: sequelize_1.DataTypes.STRING(35),
        allowNull: false
    }
}, {
    modelName: 'acquisto',
    timestamps: true,
    freezeTableName: true
});
exports.Acquisto.hasMany(exports.Modo);
exports.Modo.belongsTo(exports.Acquisto, {
    foreignKey: {
        name: 'id_acquisto'
    }
});
//Modella l'utente
exports.Utente = sequelize.define('utente', {
    email: {
        type: sequelize_1.DataTypes.STRING(35),
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING(25),
        allowNull: false
    },
    nome: {
        type: sequelize_1.DataTypes.STRING(25),
        allowNull: false
    },
    cognome: {
        type: sequelize_1.DataTypes.STRING(25),
        allowNull: false
    },
    ruolo: {
        type: sequelize_1.DataTypes.ENUM("user", "admin"),
        defaultValue: "user"
    },
    credito: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    modelName: 'utente',
    timestamps: false,
    freezeTableName: true
});
exports.Utente.hasMany(exports.Acquisto, {
    foreignKey: {
        name: "email_compr",
        allowNull: false
    }
});
exports.Acquisto.belongsTo(exports.Utente);
