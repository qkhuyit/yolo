
function SearchView(obj, type) {
    if (type == 0) {
        return `<div class="cover profile">
                    <div class="wrapper">
                        <div class="image" style="padding:0px">
                            <img src="${obj.ConverPhoto}" alt="people" style="padding:0px">
                        </div>
                    </div>
                    <div class="cover-info">
                        <div class="avatar">
                            <img src="${obj.Avatar}" alt="people">
                        </div>
                        <div class="name"><a href="/time-line/${obj._id}">${obj.FirstName} ${obj.LastName}</a></div>
                        <ul class="cover-nav" id="searchStatus">
                            <li><a href="javascript:void(0)" onclick="SendFriendRequest('${obj._id}')"><i class="fa fa-user-plus"></i> Gửi Lời Mời Kết Bạn</a></li>
                         </ul>
                      </div>
                 </div>`;
    } else if (type == 1) {
        return `<div class="cover profile">
                    <div class="wrapper">
                        <div class="image" style="padding:0px">
                            <img src="${obj.ConverPhoto}" alt="people" style="padding:0px">
                        </div>
                    </div>
                    <div class="cover-info">
                        <div class="avatar">
                            <img src="${obj.Avatar}" alt="people">
                        </div>
                        <div class="name"><a href="/time-line/${obj._id}">${obj.FirstName} ${obj.LastName}</a></div>
                        <ul class="cover-nav" id="searchStatus">
                            <li><a href="javascript:void(0)" onclick="ConfirmFriendFrequest('${obj._id}')"><i class="fa fa-user-plus"></i> Đồng Ý Kết Bạn</a></li>
                         </ul>
                      </div>
                 </div>`;

    } else if (type == 2) {
        return `<div class="cover profile">
                    <div class="wrapper">
                        <div class="image" style="padding:0px">
                            <img src="${obj.ConverPhoto}" alt="people" style="padding:0px">
                        </div>
                    </div>
                    <div class="cover-info">
                        <div class="avatar">
                            <img src="${obj.Avatar}" alt="people">
                        </div>
                        <div class="name"><a href="/time-line/${obj._id}">${obj.FirstName} ${obj.LastName}</a></div>
                        <ul class="cover-nav" id="searchStatus">
                            <li><a href="/time-line/${obj._id}"><i class="fa fa-user-plus"></i> Dòng Thời Gian</a></li>
                         </ul>
                      </div>
                 </div>`;
    }
};

function FriendRequest(account, request) {
    return `<li class="media" id="${request._id}">
                                    <div class="pull-right" style="padding:5px !important">
                                        <button class="btn btn-xs btn-danger" onclick="DeleteFriendRequest('${request._id}')">Xóa</button>
                                    </div>
                                    <div class="pull-right" style="padding:5px !important">
                                        <button class="btn btn-xs btn-primary" onclick="ConfirmFriendRequest('${request._id}')">Chấp Nhận</button>
                                    </div>
                                    <div class="media-left">
                                        <img src="${account.Avatar}" alt="people" class="img-circle" width="30" style="border-radius:0px !important">
                                    </div>
                                    <div class="media-body" style="padding:5px !important">
                                        <a href="#">${account.LastName}</a>
                                        <br>
                                    </div>
                                </li>`;
}

function Notification(obj) {
    if (obj.Status == false) {
        return `<li class="media" style="background-color:whitesmoke">
                                    <div class="media-left">
                                        <img src="${obj.Author.Avatar}" alt="people" class="img-circle" width="30">
                                    </div>
                                    <div class="media-body">
                                        <a href="#">${obj.Author.FirstName}</a> ${obj.Content}
                                        <br>
                                        <span class="text-caption text-muted">${formatDate(obj.CreatedDate)}</span>
                                    </div>
                                </li>`;
    } else {
        return `<li class="media">
                                    <div class="media-left">
                                        <img src="${obj.Author.Avatar}" alt="people" class="img-circle" width="30">
                                    </div>
                                    <div class="media-body">
                                        <a href="#">${obj.Author.FirstName}</a> ${obj.Content}
                                        <br>
                                        <span class="text-caption text-muted">${formatDate(obj.CreatedDate)}</span>
                                    </div>
                                </li>`;
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

function FriendItem(fr, check) {
    var lbl = ``;
    if (fr.IsOnline) {
        lbl = `<label style="color:#81b53e;font-size:12px" id="small${fr._id}">"Đang hoạt động"</label>`;
    } else {
        lbl = `<label style="color:grey;font-size:12px" id="small${fr._id}">"Tạm vắng"</label>`;
    }

    var css = ``;
    if (check == true) {
        css = `style="background-color:whitesmoke"`
    }
    var content = `<li class="online friendItem" id="${fr._id}" ${css}>
                        <a href="javascript:void(0)" onclick="SelectFriend('${fr._id}')">
                            <div class="media" style="margin:0px !important">
                                <div class="pull-left" style="margin-right:0px">
                                    <span class="badge floating badge-danger" style="background: #e74c3c;color:white;display:none" id="msgCount${fr._id}">1</span>
                                    <img src="${fr.Avatar}" width="50" height="50" class="img-circle">
                                </div>
                                <div class="media-body">
                                    <div class="contact-name" style="color:black">
                                        <strong>${fr.FirstName} ${fr.LastName}</strong>
                                    </div>
                                    <div class="col-xs-12" style="height:10px"></div>
                                    ${lbl}
                                </div>
                            </div>
                        </a>
                    </li>`;
    return content;
};

function GroupItem(gr, check) {
    if (check == false) {
        return `<li class="online" style="border-bottom:1px solid lightgrey;padding-top:10px;padding-bottom:10px;padding-left:10px;" id="${gr.Code}">
                        <a href="javascript:void(0)" onclick="SelectGroup('${gr.Code}')">
                            <div class="media" style="margin:0px !important">
                                <div class="pull-left" style="margin-right:0px">
                                    <span class="badge floating badge-danger" style="background: #e74c3c;color:white;display:none" id="msgCount${gr._id}">1</span>
                                    <img src="${gr.Avatar}" width="50" height="50" class="img-circle">
                                </div>
                                <div class="media-body">
                                    <div class="contact-name" style="color:black">
                                        <strong>${gr.Name}</strong>
                                    </div>
                                    <div class="col-xs-12" style="height:10px"></div>
                                    <label style="color:#81b53e;font-size:12px">"${gr.Description}"</label>
                                </div>
                            </div>
                        </a>
                    </li>`;
    }
    else {
        return `<li class="online" style="border-bottom:1px solid lightgrey;padding-top:10px;padding-bottom:10px;padding-left:10px;background-color:whitesmoke" id="${gr.Code}">
                        <a href="javascript:void(0)" onclick="SelectGroup('${gr.Code}')">
                            <div class="media" style="margin:0px !important">
                                <div class="pull-left" style="margin-right:0px">
                                    <span class="badge floating badge-danger" style="background: #e74c3c;color:white;display:none" id="msgCount${gr._id}">1</span>
                                    <img src="${gr.Avatar}" width="50" height="50" class="img-circle">
                                </div>
                                <div class="media-body">
                                    <div class="contact-name" style="color:black">
                                        <strong>${gr.Name}</strong>
                                    </div>
                                    <div class="col-xs-12" style="height:10px"></div>
                                    <label style="color:#81b53e;font-size:12px">"${gr.Description}"</label>
                                </div>
                            </div>
                        </a>
                    </li>`;
    }
};

function SelectFriend(obj, height) {
    return `<div class="col-xs-12 myHeadChatContent">
    <nav class="navbar" style="border:0px;margin:0px;height:100%">
        <div class="container" style="padding:0px !important;margin:0px !important;width:100% !important">
            <div class="navbar-header">
                <img src="${obj.Avatar}" alt="" class="img-circle" style="width:50px;height:50px">
                <label class="control-label" style="font-size:15px" id="selectedName">${obj.FirstName} ${obj.LastName}</label><br
                />
            </div>
            <div id="navbar" class="navbar-collapse collapse" style="padding:0px !important">
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown notifications updates hidden-xs hidden-sm">
                        <a href="javascript:"><i class="fa  fa-camera"></i></a>
                    </li>
                    <li class="dropdown notifications updates hidden-xs hidden-sm">
                        <a href="href="javascript:"><i class="fa fa-phone"></i></a>
                    </li>
                    <li class="dropdown notifications updates hidden-xs hidden-sm">
                        <a href="javascript:" onclick="DeleteMsg()"><i class="fa  fa-trash" style="color:red"></i></a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</div>
<div class="col-xs-12 myChatContent" id="myChatContent" style="padding:0px;height: ${height}px !important">
    <div class="col-xs-12 loader" style="height:100%;" id="loading" hidden>
        <img src="images/loading.gif" />
    </div>
    <ol class="chat" style="padding:0px !important" id="chatContent">
    </ol>
</div>
<div class="col-xs-12" style="height:50px;border-top:1px solid lightgrey;padding:0px;">
    <div class="col-xs-12" style="padding:0px;height:100%;text-align:center;padding-top:8px">
        <div class="col-xs-10 col-xs-offset-1">
            <div class="input-group">
                <input type="text" class="form-control my-white" id="txtMessage" placeholder="Nhập vào nôi dung lời nhắn ..." autofocus>
                <span class="input-group-btn">
                                            <button class="btn btn-white btn-noboder" type="button" onclick="SendImage()">
                                                <i class="fa fa-photo"></i>
                                            </button>
                                        </span>
            </div>
        </div>
    </div>
</div>`;
};

function Messages(messages, i) {
    var content = ``;
    messages.forEach((item) => {
        var id_1 = `${item.Author._id}`;
        var id_2 = `${i._id}`;
        if (id_1 === id_2) {
            var li = `<li class="self">
                                    <div class="avatar"><img src="${i.Avatar}" draggable="false"></div>
                                    <div class="msg">
                                        <p>${item.Content}</p>
                                        <time>${formatDate(item.CreatedDate)}</time>
                                    </div>
                              </li>`;
            content += li;
        } else {
            var li = `<li class="other">
                            <div class="avatar"><img src="${item.Author.Avatar}" draggable="false"></div>
                            <div class="msg">
                                <p>
                                    ${item.Content}
                                </p>
                                <time>${formatDate(item.CreatedDate)}</time>
                            </div>
                        </li>`;
            content += li;
        }
    });
    return content;
};

function SendMessage(msg) {
    return `<li class="other">
                            <div class="avatar"><img src="${msg.Author.Avatar}" draggable="false"></div>
                            <div class="msg">
                                <p>
                                    ${msg.Content}
                                </p>
                                <time>${formatDate(msg.CreatedDate)}</time>
                            </div>
                        </li>`;
};

function SelectGroup(obj, height) {
    return `<div class="col-xs-12 myHeadChatContent">
    <nav class="navbar" style="border:0px;margin:0px;height:100%">
        <div class="container" style="padding:0px !important;margin:0px !important;width:100% !important">
            <div class="navbar-header">
                <img src="${obj.Avatar}" alt="" class="img-circle" style="width:50px;height:50px">
                <label class="control-label" style="font-size:15px" id="selectedName">${obj.Name}</label><br
                />
            </div>
            <div id="navbar" class="navbar-collapse collapse" style="padding:0px !important">
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown notifications updates hidden-xs hidden-sm">
                        <a href="javascript:"><i class="fa  fa-camera"></i> </a>
                    </li>
                    <li class="dropdown notifications updates hidden-xs hidden-sm">
                        <a href="javascript:" onclick="DeleteMsgGr()"><i class="fa  fa-trash" style="color:red"></i></a>
                    </li>
                    <li class="dropdown notifications updates hidden-xs hidden-sm">
                         <a href="#sidebar-chat" data-toggle="sidebar-menu" class="toggle pull-right"><i class="fa fa-info"></i></a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</div>
<div class="col-xs-12 myChatContent" id="myChatContent" style="padding:0px;height: ${height}px !important">
    <div class="col-xs-12 loader" style="height:100%;" id="loading" hidden>
        <img src="images/loading.gif" />
    </div>
    <ol class="chat" style="padding:0px !important" id="chatContent">
    </ol>
</div>
<div class="col-xs-12" style="height:50px;border-top:1px solid lightgrey;padding:0px;">
    <div class="col-xs-12" style="padding:0px;height:100%;text-align:center;padding-top:8px">
        <div class="col-xs-10 col-xs-offset-1">
            <div class="input-group">
                <input type="text" class="form-control my-white" id="txtMessage" placeholder="Nhập vào nôi dung lời nhắn ..." autofocus>
                <span class="input-group-btn">
                                            <button class="btn btn-white btn-noboder" type="button" onclick="SendImage()">
                                                <i class="fa fa-photo"></i>
                                            </button>
                                        </span>
            </div>
        </div>
    </div>
</div>`;
};

function GroupMember(item, check) {
    if (check == true) {
        if (item.IsOnline) {
            lbl = `<label style="color:#81b53e;font-size:12px" class="lbl${item._id}">"Admin"</label>`;
        } else {
            lbl = `<label style="color:grey;font-size:12px" class="lbl${item._id}">"Admin"</label>`;
        }
        return `<li class="online friendItem"  style="border-bottom:1px solid lightgrey;">
                        <a href="javascript:void(0)">
                            <div class="media" style="margin:0px !important">
                                <div class="pull-left" style="margin-right:0px">
                                    <span class="badge floating badge-danger" style="background: #e74c3c;color:white;display:none" id="msgCount${item._id}">1</span>
                                    <img src="${item.Avatar}" width="50" height="50" class="img-circle">
                                </div>
                                <div class="media-body">
                                    <div class="contact-name" style="color:black">
                                        <strong>${item.FirstName} ${item.LastName}</strong>
                                    </div>
                                    <div class="col-xs-12" style="height:10px"></div>
                                    ${lbl}
                                </div>
                            </div>
                        </a>
                    </li>`;
    } else {
        if (item.IsOnline) {
            lbl = `<label style="color:#81b53e;font-size:12px" class="lbl${item._id}">"Member"</label>`;
        } else {
            lbl = `<label style="color:grey;font-size:12px" class="lbl${item._id}">"Member"</label>`;
        }
        return `<li class="online friendItem"  style="border-bottom:1px solid lightgrey;">
                        <a href="javascript:void(0)">
                            <div class="media" style="margin:0px !important">
                                <div class="pull-left" style="margin-right:0px">
                                    <span class="badge floating badge-danger" style="background: #e74c3c;color:white;display:none" id="msgCount${item._id}">1</span>
                                    <img src="${item.Avatar}" width="50" height="50" class="img-circle">
                                </div>
                                <div class="media-body">
                                    <div class="contact-name" style="color:black">
                                        <strong>${item.FirstName} ${item.LastName}</strong>
                                    </div>
                                    <div class="col-xs-12" style="height:10px"></div>
                                    ${lbl}
                                </div>
                            </div>
                        </a>
                    </li>`
    }
}

module.exports = {
    SearchView: SearchView,
    FriendRequest: FriendRequest,
    Notification: Notification,
    FriendItem: FriendItem,
    GroupItem: GroupItem,
    SelectFriend: SelectFriend,
    Messages: Messages,
    SendMessage: SendMessage,
    GroupMember: GroupMember,
    SelectGroup: SelectGroup
};