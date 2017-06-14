$(document).ready(() => {

    deviceScreenHeigt = $(window).height() - (51 + 50 + 50 + 45);

    $(document).keypress(function (e) {
        if (e.which == 13) {
            var message = '';
            var message = $("#txtMessage").val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
            if (message.trim() != '') {
                message = message.trim();
                var objMessage = {
                    Content: message,
                    Type: 'Text'
                }
                socket.emit('SendMessage', objMessage);

                var content = `<li class="self">
                                    <div class="avatar"><img src="${user.Avatar}" draggable="false"></div>
                                    <div class="msg">
                                        <p>${message}</p>
                                        <time>${formatDate(new Date)}</time>
                                    </div>
                              </li>`;
                $("#chatContent").append(content);
                ScrollBottom();
                $("#txtMessage").val('');
                $("#chatContent").show();
                $("#loading").hide();
            }
        }
    });

    $("#btnImgMsg").click(() => {
        alert("a");
    });

    $("#btnSearch").click(() => {
        $("#searchBody").empty();
        var keyword = $("#keyword").val().trim();
        if (keyword == '') {
            var content = `<div class="col-xs-12 text-center"><label style="color:goldenrod"><i>Vui lòng nhập vào gì đó !!!</i></label></div>`;
            $("#searchBody").css("height", 60);
            $("#searchBody").append(content);
        } else {
            socket.emit('Search', keyword);
        }
    });

    $("#grCode").keypress(() => {
        $("#divCode").css('display', 'none');
    });

    $("#grName").keypress(() => {
        $("#divName").css('display', 'none');
    });

    $("#grDescription").keypress(() => {
        $("#divDes").css('display', 'none');
    });
    $("#addMember").keypress(() => {
        $("#divAddMember").css('display', 'none');
    });

    $("#btnSearch").click(() => {
        SearchFriend();
    });
});

function SendFriendRequest(id) {
    socket.emit('SendFriendRequest', id);
}

function ConfirmFriendRequest(id) {
    $("#" + id).remove();
    socket.emit('ConfirmFriendRequest', id);
    $("#lstFriendRequestCount").css('display', 'none');
}

function ViewNotification() {
    notifications = 0;
    $("#lstNotificationCount").css('display', 'none');
    socket.emit('ViewNotification');
}

function Upload() {
    var formData = new FormData();
    formData.append('file', $('#file')[0].files[0]);
    $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            data = data.replace('public', '');
            grAvatar = data;
            $("#img").attr("src", data);
        }
    });
}

function CreateGroup() {
    var gr = {
        Code: $("#grCode").val(),
        Name: $("#grName").val(),
        Description: $("#grDescription").val(),
        Avatar: grAvatar
    };
    var validate = ValidateGroup(gr);
    if (validate) {
        socket.emit('CreateGroup', gr);
    }
};

function ValidateGroup(gr) {
    var status = true;
    if (gr.Code == '' || gr.Code.toString().length < 6 || gr.Code.toString().length > 6) {
        $("#errorCode").text('Mã nhóm phải là số và có độ dài bằng 6 chữ số.');
        $("#divCode").css('display', 'block');
        status = false;
    }
    if (gr.Name == '' || gr.Code.Name > 50) {
        $("#errorName").text('Tên nhóm không được rỗng và có độ dài không quá 50 ký tự.');
        $("#divName").css('display', 'block');
        status = false;
    }
    if (gr.Description == '' || gr.Description > 50) {
        $("#errorDes").text('Mô tả không được rỗng và có độ dài không quá 50 ký tự.');
        $("#divDes").css('display', 'block');
        status = false;
    }
    return status;
};

function SelectFriend(id) {
    if (current !== id) {
        $("#lstMembers").empty();
        socket.emit('SelectFriend', id);
        current = id;
        $(`#${id}`).css('background-color', 'white');
    }
}

function padValue(value) {
    return (value < 10) ? "0" + value : value;
};

function formatDate(dateVal) {
    var newDate = new Date(dateVal);

    var sMonth = padValue(newDate.getMonth() + 1);
    var sDay = padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = padValue(newDate.getMinutes());
    var sAMPM = "AM";

    var iHourCheck = parseInt(sHour);

    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if (iHourCheck === 0) {
        sHour = "12";
    }

    sHour = padValue(sHour);

    return sDay + "/" + sMonth + "/" + sYear + " at " + sHour + ":" + sMinute + " " + sAMPM;
};

function ScrollBottom() {
    var objDiv = document.getElementById("myChatContent");
    objDiv.scrollTop = objDiv.scrollHeight;
};

function SelectGroup(id) {
    if (current !== id) {
        socket.emit('SelectGroup', id);
        $("#lstMembers").empty();
        current = id;
        $(`#${id}`).css('background-color', 'white');
        socket.emit('ViewMessage_Group');
    }
}

function DeleteMsg() {
    $('#dialogDeleteMsg').modal('show'); 
};

function DeleteMsgNow() {
    socket.emit('DeleteMessage');
};

function ChangePassword() {
    var obj = {
        Pass: $("#pass").val(),
        NewPass: $("#newPass").val(),
        RePass: $("#rePass").val()
    }
    socket.emit('ChangePassword', obj);
};

function AddMember() {
    var email = $("#addMember").val();
    if (email == '') {
        $("#errorAddMember").text('Vui lòng nhập vào Email.');
        $("#divAddMember").css('display', 'block');
    } else {
        socket.emit('AddGroupMember', email);
    }
};

function DeleteMsgGr() {
    $('#dialogDeleteMsgGr').modal('show'); 
}

function DeleteMsgNowGr() {
    socket.emit('DeleteMsgGr');
};

function SendImage() {
    $('#imgMessage').trigger('click');
}

function Send() {
    var formData = new FormData();
    formData.append('file', $('#imgMessage')[0].files[0]);
    $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            data = data.replace('public', '')
            $("#image").attr("src", data);
            var content = `<img src="${data}" style="max-width:200px;max-height:300px"></img>`
            var objMessage = {
                Content: content,
                Type: 'Image'
            }
            socket.emit('SendMessage', objMessage);

            var content = `<li class="self">
                                    <div class="avatar"><img src="${user.Avatar}" draggable="false"></div>
                                    <div class="msg">
                                        <p>${content}</p>
                                        <time>${formatDate(new Date)}</time>
                                    </div>
                              </li>`;
            $("#chatContent").append(content);
            ScrollBottom();
            $("#txtMessage").val('');
            $("#chatContent").show();
            $("#loading").hide();
        }
    });
}