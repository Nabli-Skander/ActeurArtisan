<?php
$e = array();
$e['error'] = "Formulaire non valide";
if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)){
    $e['email_invalide'] = "email_invalide";
}else{
    $e['error'] = 'Ok';
    $nom = $_POST['nom'];
    $sujet = $_POST['sujet'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    $to = 'skandernabli34@gmail.com';
    $msg = $message;
    mail($to, $sujet, $msg);

}

echo json_encode($e);
?>
