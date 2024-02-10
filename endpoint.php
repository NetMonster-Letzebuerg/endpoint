<?php
// https://netmonster.app/#docs-owner-receive
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { //Netmonster envoie uniquement des requéte POST
    header('HTTP/1.1 405 Method Not Allowed');
    exit('Method Not Allowed');
}