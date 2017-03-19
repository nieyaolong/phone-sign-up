function warnNote(obj, text) {
    obj.parent("p").find('span').css({"color":" #ff0000", "font-size" : "1rem"}).text(text);
    obj.addClass("empty-warning");
}

//时钟
function startClock(_this, timer, seconds) {
    _this.attr("disabled", "true");
    _this.val(seconds + 's');

    clearInterval(timer);
    timer = setInterval(function () {
        seconds--;
        if (seconds > 0) {
            _this.val(seconds + 's');
        }
        else {
            clearInterval(timer);
            _this.val("重新发送");
            _this.removeAttr("disabled");
        }
    }, 1000);
}

$(function () {
    var userName = $("#username");
    var userPhone = $("#userphone");
    var major = $("#major");
    var score = $("#score");
    var imgValidateCode = $("#img-validate-code");
    var svgCode = $("#svg-code");
    var changeImgCode = $("#change-img-code");
    var msgValidateBtn = $("#msg-validate-btn");
    var submit = $("#submit");
    var finished = $(".finish-btn");
    var closeWin = $(".close");

    var phoneRegx = /^((13[0-9])|(15([0-9]))|(18[0-9]))\d{8}$/;

    //获取焦点时
    $(".center-content > p").each(function () {
        $(this).find("input").on("focus", function () {
            $(this).removeClass("empty-warning");
            $(this).parent("p").find("span").text("")
        }).on("blur", function () {
            var phoneNum = userPhone.val();

            if(!!phoneNum && !phoneRegx.test(phoneNum))
            {
                warnNote(userPhone, "格式错误")
            }else{
                $(this).parent("p").find("span").css("color", "#c0c0c4").text("(必填)")
            }
        })
    });

    //获取图片验证码
    changeImgCode.on("click", function () {
        //发送获取验证码请求
        $.ajax({
            url: "",
            data: "",
            dataType: "xml",
            type: "get",
            cache: false,
            success: function (data) {
                //获取成功
                svgCode.attr("src", data.url);
                msgValidateBtn.parent("p").css("display", "block");
            },
            error: function () {
                //获取失败
                $(this).text("重新获取");
                msgValidateBtn.parent("p").css("display", "none");
            }
        })
    });

    //通知发送短信验证码
    msgValidateBtn.on("click", function () {
        var _this = $(this);
        var seconds = 49;
        var timer = null;
        var phoneNum = userPhone.val();

        if (!!phoneNum) {
            if(phoneRegx.test(phoneNum)) {
                //开始计时
                startClock(_this, timer, seconds);

                $.ajax({
                    url: "",
                    data: "",
                    dataType: "xml",
                    type: "get",
                    cache: false,
                    timeout: seconds + 1,
                    success: function (data) {
                        _this.text("发送成功");
                        console.log("success")
                    },
                    error: function () {
                        //获取失败
                        _this.text("重新获取");
                    }
                })
            }else{
                warnNote(userPhone, "*格式错误")
            }
        } else {
            warnNote(userPhone, "*不能为空");
        }
    });

    //提交
    submit.on("click", function () {
        if (!!userName.val() || !!userPhone.val()) {
            var name = userName.val();
            var msgCode = userPhone.val();
            var major = major.val();
            var score = score.val();

            //发送数据到后台
            $.ajax({
                url: "",
                data: {
                    name: name,
                    phone: phone,
                    code: msgCode,
                    major: major,
                    score: score
                },
                dataType: "text",
                type: "post",
                cache: false,
                success: function (data) {
                    //验证输入的验证码与短信验证码是否一致
                    if ($("#msg-validate").val() == "") {
                        //弹出注册成功提示窗口
                        $("#fix-screen").css("visibility", "visible");
                    }
                    else {
                        $("#time-out-warn").css("display", "inline-block");
                        msgValidateBtn.val("重新获取");
                    }
                },
                error: function (error) {
                    //失败时
                    $(".error-warn").css({"display": "inline-block", "transition":"display 0.5s ease-out"}).text(error.message)
                }
            });
        } else {
            warnNote(userName, "*不能为空");
            warnNote(userPhone, "*不能为空")
        }
    });

    //关闭提示窗口
    closeWin.on("click", function () {
        $("#fix-screen").css("visibility", "hidden")
    })
    //点击完成
    finished.on("click", function(){
        $("#fix-screen").css("visibility", "hidden");
        $(".center-content > p").each(function () {
            $(this).find("input[type='text']").val("");
        })
    })
})