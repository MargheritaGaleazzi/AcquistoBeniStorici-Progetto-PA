CREATE DATABASE IF NOT EXISTS gestione_acquisto_beni;
DROP TABLE IF EXISTS
    `acquisto`;
DROP TABLE IF EXISTS
    `bene`;
DROP TABLE IF EXISTS
    `utente`;
CREATE TABLE `utente`(
    `email` VARCHAR(35) NOT NULL,
    `username` VARCHAR(25) NOT NULL,
    `nome` VARCHAR(25) NOT NULL,
    `cognome` VARCHAR(25) NOT NULL,
    `ruolo` ENUM('user', 'admin') DEFAULT 'user',
    `credito` INT(10) NOT NULL,
    PRIMARY KEY(`email`)
); CREATE TABLE `bene`(
    `id` INT(10) NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `tipo` ENUM(
        'manoscritto',
        'cartografia storica'
    ) DEFAULT 'manoscritto',
    `anno` INT(4) NOT NULL,
    `prezzo` INT(3) NOT NULL,
    PRIMARY KEY(`id`)
); CREATE TABLE `acquisto`(
    `id` INT(10) NOT NULL AUTO_INCREMENT,
    `formato` ENUM('jpg', 'tiff', 'png') DEFAULT 'jpg',
    `email_compr` VARCHAR(35) NOT NULL,
    `beneId` INT(10) NOT NULL,
    `tipo_acq` ENUM(
        'download originale',
        'download aggiuntivo'
    ) DEFAULT 'download originale',
    `nDownload` INT(1) NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`email_compr`) REFERENCES `utente`(`email`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`beneId`) REFERENCES `bene`(id) ON DELETE CASCADE ON UPDATE CASCADE 
); INSERT INTO `utente`(
    `email`,
    `username`,
    `nome`,
    `cognome`,
    `ruolo`,
    `credito`
)
VALUES(
    'rossiMario@gmail.com',
    'RosMar',
    'Mario',
    'Rossi',
    'user',
    150
),(
    'luigiVerdi@alice.it',
    'VerLug',
    'Luigi',
    'Verdi',
    'user',
    120
),(
    'mariaBianchi@gmail.com',
    'Mary',
    'Maria',
    'Bianchi',
    'user',
    15
),(
    'cass.lof@alice.it',
    'Cassidy',
    'Cassandra',
    'Loffanzi',
    'user',
    0
),(
    'giovi@alice.it',
    'Giova',
    'Giovanni',
    'Saluti',
    'user',
    23
),(
    'babiFre@alice.it',
    'Barbara',
    'Barbara',
    'Frescati',
    'admin',
    999
);
INSERT INTO `bene`(
    `id`,
    `nome`,
    `tipo`,
    `anno`,
    `prezzo`
)
VALUES(1,'Aristotle_latin_manuscript.jpg','manoscritto',355,28),
(2,'cart_Roma_Capitale.jpg','cartografia storica',427,36),
(3,'fiume_PO.jpg','cartografia storica',1576,10),
(4,'Karl-VI-Praesentirt-per-notarium.jpg','manoscritto',1370,120),
(5,'Tibullo-Albio-cavaliere-Romano-elogio1°-tradotto-dal-latino.jpg','manoscritto',800,85),
(6, 'Ruth-Ecclesiaste-&-tikun-Yemen.jpg', 'manoscritto', 1850, 36),
(7, 'King-George.jpg','manoscritto', 1735, 103),
(8, 'Antica-Lettera-Magia','manoscritto',1600, 22),
(9, 'Marchese-FRANCESCO-CASALI.jpg','manoscritto', 1668, 70),
(10, 'campagna-romana.jpg','cartografia storica', 1972, 24),
(11, 'lazio-nella-carta-italiana.jpg', 'cartografia storica', 1477, 55),
(12, 'Lazio-Fra-Paolino.jpg', 'cartografia storica', 1334, 86),
(13, 'Pesaro.jpg', 'cartografia storica', 1500, 40),
(14, 'legazione-pesaro-urbino.jpg', 'cartografia storica', 1844, 120),
(15, 'delegazione-ancona.jpg', 'cartografia storica', 1844, 115),
(16, 'italia.jpg', 'cartografia storica', 1765, 96),
(17, 'siena-ducato.jpg', 'cartografia storica', 1663, 205),
(18, 'antica-urbino', 'manoscritto', 1713, 105),
(19, 'comitato-liberazione.jpg', 'manoscritto', 1945, 36),
(20, 'doge-michele-steno.jpg', 'manoscritto', 1406, 94);
INSERT INTO `acquisto`(
    `id`,
    `formato`,
    `email_compr`,
    `beneId`,
    `tipo_acq`,
    `nDownload`
)
VALUES(
    1,
    'jpg',
    'rossiMario@gmail.com',
    1,
    'download originale',
    1
    ),(
    2, 
    'png', 
    'giovi@alice.it', 
    4, 
    'download originale',
    0
    ),(
    3, 
    'jpg', 
    'giovi@alice.it', 
    4, 
    'download aggiuntivo',
    1
    );