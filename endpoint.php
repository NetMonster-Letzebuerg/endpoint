<?php
// https://netmonster.app/#docs-owner-receive
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { //Netmonster envoie uniquement des requéte POST
    header('HTTP/1.1 405 Method Not Allowed');
    exit('Method Not Allowed');
}

//Vérification si c'est un fichier JSON
$content = file_get_contents("php://input");
$jsonData = json_decode($content);

if ($jsonData === null && json_last_error() !== JSON_ERROR_NONE) {
    header('HTTP/1.1 400 Bad Request');
    exit('Invalid JSON');
}

if (!isset($jsonData->author) || !isset($jsonData->date)) {
    header('HTTP/1.1 400 Bad Request');
    exit('JSON must contain "author" and "date" keys.');
}

// Créer le nom de fichier en utilisant les valeurs de "author" et "date"
$filename = 'data/' . $jsonData->author . '_' . $jsonData->date . '.json';

// Enregistrer le JSON dans un fichier
$file = fopen($filename, 'w');
fwrite($file, json_encode($jsonData, JSON_PRETTY_PRINT));
fclose($file);

// Répondre avec succès
header('HTTP/1.1 200 OK');
exit('Data successfully saved.');