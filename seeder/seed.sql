CREATE TABLE utente (
    email varchar(25) NOT NULL,
    username varchar(25) NOT NULL
    nome varchar(25) NOT NULL,
    cognome varchar(25) NOT NULL,
    ruolo enum("user","admin"),
    tokenJWT int() NOT NULL,
    credito int() NOT NULL,
    PRIMARY KEY(email)
);

CREATE TABLE bene (
    id int NOT NULL AUTO_INCREMENT,
    nome varchar(20) NOT NULL,
    tipo enum('manoscritto','cartografia storica'),
    anno int(4) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE acquisto (
    id int NOT NULL AUTO_INCREMENT,
    formato enum("jpg","tiff","png"),
    tipo_acq enum("da scaricare","download originale", "download aggiuntivo"),
    PRIMARY KEY(id)
);