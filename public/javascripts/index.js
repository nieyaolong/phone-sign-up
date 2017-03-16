$(".send").click(function () {
    $.post("/sms", {phone: $("#phone").val(), captcha: $("#captcha").val()})
        .done(function () {
            $("#code").attr("disabled", false);
            $("#result").text("send sms success");
        })
        .fail(function (data) {
            $("#result").text(data.responseText);
        })
        .always(function () {
            // $("#svg").load('/captcha')
        });
});

$(".sign-up").click(function () {
    let data = {
        name: $("#name").val(),
        phone: $("#phone").val(),
        code: $("#code").val()
    };
    $.post("/", data)
        .done(function () {
            $("#result").text("sign up success");
        })
        .fail(function (data) {
            console.error(data);
            $("#result").text(data.responseText);
        })
});