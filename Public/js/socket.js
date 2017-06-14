$(document).ready(() => {
    socket.on('Search', data => {
        if (data.Status == false && data.Data == null) {
            var content = `<div class="col-xs-12 text-center"><label style="color:goldenrod"><i>Không tìm thấy kết quả phù hợp nào !!!</i></label></div>`;
            $("#searchBody").css("height", 60);
            $("#searchBody").append(content);
        } else {
            console.log(data);
            $("#searchBody").append(data.Data);
        }
    });

    socket.on('SendFriendRequest', data => {
        if (data.Status == 'Warning') {
            toastr.warning(data.Message);
        } else {
            toastr.success(data.Message);
        }
    });

    socket.on('FriendRequest', data => {
        $("#lstFriendRequest").append(data);
        friendRequests += 1;
        $("#lstFriendRequestCount").empty();
        $("#lstFriendRequestCount").append(friendRequests);
        $("#lstFriendRequestCount").css('display', 'block');
    });

    socket.on('Notification', data => {
        $("#lstNotification").append(data);
        notifications += 1;
        $("#lstNotificationCount").empty();
        $("#lstNotificationCount").append(notifications);
        $("#lstNotificationCount").css('display', 'block');
    });

    socket.on('LoadFriends', data => {
        if (data) {
            $("#lstFriends").append(data);
        }
    });

    socket.on('Online', data => {
        $("#small" + data).text("\"Đang hoạt động\"");
        $("#small" + data).css('color', '#81b53e');
        $('.lbl' + data).css('color', '#81b53e');
        socket.emit('Online', data);
    });

    socket.on('Offline', data => {
        $("#small" + data).text("\"Tạm vắng\"");
        $('.lbl' + data).css('color', 'grey');
        $("#small" + data).css('color', 'grey');
    });

    socket.on('CreateGroup', data => {
        if (data.Status == true) {
            toastr.success(data.Message);
            $("#lstGroup").append(data.Data);
            $("#grCode").val('');
            $("#grName").val('');
            $("#grDescription").val('');
            grAvatar = '/images/seed/avatar/group.png';
            $("#img").attr("src", '/images/seed/avatar/group.png');
        } else {
            toastr.error(data.Message);
        }
    });

    socket.on('LoadGroups', data => {
        $("#lstGroup").append(data);
    });

    socket.on('SelectFriend', data => {
        $("#msgContent").empty();
        $("#msgContent").append(data);
        $("#loading").show();
        $("#chatContent").hide();
    });

    socket.on('Messages', (data) => {
        $("#chatContent").append(data);
        setTimeout(function () {
            $("#chatContent").show();
            $("#loading").hide();
            ScrollBottom();
        }, 200);
    });

    socket.on('SendMessage', data => {
        if (data.ID != current) {
            $(`#${data.ID}`).css('background-color', 'whitesmoke');
            return;
        } else if (data.ID == current) {
            $("#chatContent").append(data.Content);
            ScrollBottom();
            socket.emit('ViewMessage');
        }
    });

    socket.on('SelectGroup', data => {
        $("#msgContent").empty();
        $("#msgContent").append(data);
        $("#loading").show();
        $("#chatContent").hide();
    });

    socket.on('DeleteMessage', data => {
        if (data == true) {
            $("#chatContent").empty();
        }
    });

    socket.on('ChangePassword', data => {
        if (data.Status == false) {
            $("#errChangePass").text(data.Message);
            $("#divErrChangePass").css('display', 'block');
        } else {
            $('#dialogChangePassword').modal('toggle');
            toastr.success(data.Message);
        }
    });

    socket.on('LoadMembers', data => {
        if (data) {
            $("#lstMembers").append(data);
        }
    });

    socket.on('AddGroupMember', data => {
        if (data.Status == false) {
            $("#errorAddMember").text(data.Message);
            $("#divAddMember").css('display', 'block');
        } else {
            toastr.success(data.Message);
            var email = $("#addMember").val('');
            $('#dialogAddGroupMemmber').modal('toggle');
        }
    });

    socket.on('MsgGroup', data => {
        if (data.Destination != current) {
            $("#" + data.Destination).css('background-color', 'whitesmoke');
            return;
        } else if (data.Author == user.ID) {
            socket.emit('ViewMessage_Group', 1);
            return;
        } else if (data.Author != user.ID && data.Destination == current) {
            $("#chatContent").append(data.Data);
            ScrollBottom();
        }
    });
});