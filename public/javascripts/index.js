$(".send").click(function() {
    $.post("/sms",{phone: $("#phone").val(), captcha: $("#captcha").val()})
        .done(function(){
            $("#sms_result").text("success");
        })
        .fail(function (data){
            $("#sms_result").text(data.statusText);
        })
        .always(function (){
            // $("#svg").load('/captcha')
        });
});
