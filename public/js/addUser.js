$(function () {
    $("#btn").on("click", () => {
        const $username = $("#username").val();
        const $userage = $("#userage").val();
        const $usersex = $("#usersex").val();
        const $userclass = $("#userclass").val();
        $.ajax({
            url: "/users/add",
            type: "get",
            data: {
                username: $username,
                userage: $userage,
                usersex: $usersex,
                userclass: $userclass
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