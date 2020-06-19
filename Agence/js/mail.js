$(document).ready(function(){
    $('#form').submit(function(){
        nom = $(this).find("#name").val();
        prenom = $(this).find("#prenom").val();
        email = $(this).find("#email").val();
        sujet = $(this).find("#sujet").val();
        message = $(this).find("#message").val();
        

        $.post('contact.php',{
            nom:nom,
            prenom:prenom,
            sujet:sujet,
            email:email,
            message:message
        },function(data){
            if(data.error=='Ok'){
                $('.alert_notification_error').fadeOut('fast');
                $('#submit').fadeOut('fast');
                $('.alert_notification_succes').fadeIn('slow');
            }else{
                $('.alert_notification_error').fadeIn('slow');
            }
        },"json");
        return false;
    });
});