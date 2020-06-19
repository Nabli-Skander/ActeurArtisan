$(document).ready(function(){
    $('#form').submit(function(){
        nom = $(this).find("#name").val();
        email = $(this).find("#email").val();
        sujet = $(this).find("#sujet").val();
        message = $(this).find("#message").val();

        $.post('contact.php',{
            nom:nom,
            sujet:sujet,
            email:email,
            message:message
        },function(data){
            if(data.error=='Ok'){
                $('.alert_notification_error').fadeOut('fast');
                $('.contact_status').fadeOut('fast');
                $('.alert_notification_succes').fadeIn('slow');
            }else{
                $('.alert_notification_succes').fadeOut('fast');
                $('.alert_notification_error').fadeIn('slow');
            }
        },"json");
        return false;
    });
});