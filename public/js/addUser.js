$(function () {
    $("#btn").on("click", () => {
        $.ajax({
            url: "/users/add",
            type: "get",
            data: {
                username: $("#username").val(),
                userage: $("#userage").val(),
                usersex: $("#usersex").val(),
                userclass: $("#userclass").val(),
            },
            success: (data) => {
                console.log(data);
                if(data.code == 500) {
                    $(".alert-danger").fadeIn(400);
                    $(".alert-danger").text(data.msg);
                    return;
                }
                if(data.code == 200) {
                    // $(".alert-danger").fadeIn(400);
                    // $(".alert-danger").text(data.msg);
                    setTimeout(() => {
                        location.href = "/ideas";
                    },3000)
                }
            }
        })
    });
});