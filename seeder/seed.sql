CREATE TABLE utente (
    email varchar(35) NOT NULL,
    username varchar(25) NOT NULL
    nome varchar(25) NOT NULL,
    cognome varchar(25) NOT NULL,
    ruolo enum("user","admin"),
    credito int() NOT NULL,
    PRIMARY KEY(email)
);

CREATE TABLE bene (
    id int NOT NULL AUTO_INCREMENT,
    nome varchar(20) NOT NULL,
    tipo enum('manoscritto','cartografia storica'),
    anno int(4) NOT NULL,
    id_acquisto int(),
    PRIMARY KEY(id)
);

CREATE TABLE acquisto (
    id int NOT NULL AUTO_INCREMENT,
    formato enum("jpg","tiff","png"),
    tipo_acq enum("da scaricare","download originale", "download aggiuntivo"),
    email_compr varchar(35) NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO utente (email, username, nome, cognome, ruolo, credito) VALUES
    ("rossiMario@gmail.com", "RosMar", "Mario", "Rossi", "user",150),
    ("luigiVerdi@alice.it", "VerLug", "Luigi", "Verdi", "user",120),
    ("mariaBianchi@gmail.com", "Mary", "Maria", "Bianchi", "user",15),
    ("cass.lof@alice.it", "Cassidy", "Cassandra", "Loffanzi", "user",0),
    ("giovi@alice.it", "Giova", "Giovanni", "Saluti","user",23),
    ("babiFre@alice.it", "Barbara", "Barbara", "Frescati", "admin",999);

INSERT INTO bene (nome,tipo,anno,id_acquisto) VALUES 
("Aristotle_latin_manuscript.jpg",)
("cart_Roma_Capitale.jpg")
("fiume_PO.jpg")
("Karl-VI-Praesentirt-per-notarium.jpg")
("Tibullo-Albio-cavaliere-Romano-elogio1°-tradotto-dal-latino.jpg")
