CREATE TABLE utente (
    email varchar(35) NOT NULL,
    username varchar(25) NOT NULL,
    nome varchar(25) NOT NULL,
    cognome varchar(25) NOT NULL,
    ruolo enum('user','admin'),
    credito int(10) NOT NULL,
    PRIMARY KEY(email)
);

CREATE TABLE bene (
    id int NOT NULL AUTO_INCREMENT,
    nome varchar(20) NOT NULL,
    tipo enum('manoscritto','cartografia storica'),
    anno int(4) NOT NULL,
    prezzo int() NOT NULL,
    nDownload int(),
    PRIMARY KEY(id)
);

CREATE TABLE acquisto (
    id int NOT NULL AUTO_INCREMENT,
    formato enum('jpg','tiff','png') DEFAULT 'jpg',
    email_compr varchar(35) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(email_compr) REFERENCES utente (email)
);

CREATE TABLE modo (
    id int NOT NULL AUTO_INCREMENT,
    id_acquisto int() NOT NULL,
    id_bene int() NOT NULL,
    tipo_acq enum('da scaricare','download originale', 'download aggiuntivo'),
    PRIMARY KEY(id),
    FOREIGN KEY(id_acquisto) REFERENCES acquisto (id),
    FOREIGN KEY(id_bene) REFERENCES bene (id)
);



INSERT INTO utente (email, username, nome, cognome, ruolo, credito) VALUES
    ('rossiMario@gmail.com', 'RosMar', 'Mario', 'Rossi', 'user',150),
    ('luigiVerdi@alice.it', 'VerLug', 'Luigi', 'Verdi', 'user',120),
    ('mariaBianchi@gmail.com', 'Mary', 'Maria', 'Bianchi', 'user',15),
    ('cass.lof@alice.it', 'Cassidy', 'Cassandra', 'Loffanzi', 'user',0),
    ('giovi@alice.it', 'Giova', 'Giovanni', 'Saluti','user',23),
    ('babiFre@alice.it', 'Barbara', 'Barbara', 'Frescati', 'admin',999);

INSERT INTO bene (nome,tipo,anno,prezzo,nDownload) VALUES 
    ('Aristotle_latin_manuscript.jpg','manoscritto',28,0),
    ('cart_Roma_Capitale.jpg','cartografia storica',36,1),
    ('fiume_PO.jpg','cartografia storica',10,0),
    ('Karl-VI-Praesentirt-per-notarium.jpg','manoscritto',120,0),
    ('Tibullo-Albio-cavaliere-Romano-elogio1°-tradotto-dal-latino.jpg','manoscritto',85,2);

INSERT INTO acquisto (formato,tipo_acq,email_compr) VALUES
    ('jpg','rossiMario@gmail.com'),
    ('png','giovi@alice.it'),
    ('jpg','giovi@alice.it');

INSERT INTO modo (id_acquisto,id_bene,tipo_acq) VALUES 
    (0,1,'download origiale'),
    (1,4,'download originale'),
    (2,4,'download aggiuntivo');
