$(function () {
    $.ajax({
        url: "/users/list",
        type: "get",
        data: {
            page: 0,
            size: 3
        }
    }).then(rs => {
        $('tbody').empty();
        // console.log(rs);
        // console.log(rs.item.length);
        for (let i = 0; i < rs.item.length; i++) {
            let item = rs.item[i];
            let id = rs.id[i];
            // console.info(id);
            var tr = "<tr><td class='id' style='display:none'>" + id.id + "</td>"
                + "<td>" + item.stu_name + "</td>"
                + "<td>" + item.stu_age + "</td>"
                + "<td>" + item.stu_sex + "</td>"
                + "<td>" + item.stu_class + "</td>"
                + "<td><span class='btn btn-primary btn-sm'>编辑</span><span class='btn btn-danger btn-sm' style='margin-left: 10px'>删除</span></td>"
                + "</tr>";
            $('tbody').append(tr);
        }
    })
    $("tbody").on("click", ".btn-primary", function () {
        const uId = $.trim($(this).parent().siblings().eq(0).text());
        location.href = "/users/edit/" + uId;
    })

    $("tbody").on("click", ".btn-danger", function () {
        const uId = $.trim($(this).parent().siblings().eq(0).text());
        $.ajax({
            url: "/users/delete/",
            type: "post",
            data: {
                id: uId
            },
            success: (rs) => {
                console.log(rs);
                if (rs.code == 500) {
                    $(".alert-danger").fadeIn(400);
                    $(".alert-danger").text(rs.msg);
                    return;
                }

                if (rs.code == 200) {
                    // $(".alert-danger").fadeIn(400);
                    // $(".alert-danger").text(rs.msg);
                    setTimeout(function() {
                        location.href = "/ideas";
                    },3000);
                    return;
                }
            }
        });
    })
})