<?php
$e = array();
$e['error'] = "Formulaire non valide";
if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)){
    $e['email_invalide'] = "email_invalide";
}else{
    $e['error'] = 'Ok';
    $prenom = $_POST['prenom'];
    $nom = $_POST['nom'];
    $sujet = $_POST['sujet'];
    $email = $_POST['email'];
    $message =  $_POST['message'];
    $msg = "Vous avez reçu un nouveau message Agence-Acteurs-Artisans : <br><br><br> 
    Nom, Prénom :$nom $prenom<br> <br>
    Email : $email<br><br>
    Sujet : $sujet<br><br><br>
    Message : $message";
    $to = 'frcabotdavid@gmail.com';
    $header = "MIME-Version: 1.0\r\n"; 
	$header .= "Content-type: text/html; charset=UTF-8\r\n";
    $header .= 'Content-Transfer-Encoding: 8bit'."\r\n";
	$header .= "From: ".$nom." <".$email.">"."\r\n"; 

    mail($to, $sujet, $msg, $header);

}

echo json_encode($e);
?>
