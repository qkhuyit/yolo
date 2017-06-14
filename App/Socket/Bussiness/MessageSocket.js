var MessageDAL = require('../../DataAccess/MessageDAL'),
    q = require('q'),
    Message = require('../../Models/Message'),
    FriendDAL = require('../../DataAccess/FriendDAL'),
    ViewHelper = require('../../Commons/ViewHelper'),
    GroupMemberDAL = require('../../DataAccess/GroupMemberDAL'),
    AccountDAL = require('../../DataAccess/AccountDAL'),
    GroupMember = require('../../Models/GroupMember');

function SendMessage_Friend(io, socket, data) {
    var msg = new Message({
        UserID: socket.Account._id,
        To: socket.Current.Data._id,
        Author: socket.Account,
        Watched: false,
        Type: 'Text',
        CreatedDate: new Date,
        Content: data.Content
    });
    msg.save();
    var model = {
        ID: socket.Account._id,
        Content: ViewHelper.SendMessage(msg)
    };
    var msg2 = new Message({
        UserID: socket.Current.Data._id,
        To: socket.Account._id,
        Author: socket.Account,
        Watched: false,
        Type: 'Text',
        CreatedDate: new Date,
        Content: data.Content
    });
    msg2.save();
    var model2 = {
        ID: socket.Account._id,
        Content: ViewHelper.SendMessage(msg2)
    };
    io.to(socket.Current.Data.SocketID).emit('SendMessage', model2);
}

function LoadMessages_Friend(socket) {
    Message.find({ 'UserID': socket.Account._id, 'To': socket.Current.Data._id }, (err, msgs) => {
        if (err) {
            console.log(err);
        } else {
            if (msgs) {
                var content = ViewHelper.Messages(msgs, socket.Account);
                socket.emit('Messages', content);
            }
        }
    });
};

function LoadMessages_Group(socket) {
    Message.find({ UserID: `${socket.Account._id}`, To: `${socket.Current.Data.Code}` }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result) {
                var content = ViewHelper.Messages(result, socket.Account);
                socket.emit('Messages', content);
            }
        }
    });
};

function DeleteMessage(socket) {
    Message.remove({UserID: socket.Account._id, To: socket.Current.Data._id }, err => {
        if (err) {
            console.log(err);
        } else {
            socket.emit('DeleteMessage', true);
        }
    });
};

function DeleteMessageGr(socket) {
    Message.remove({ UserID: `${socket.Account._id}`, To: `${socket.Current.Data.Code}` }, err => {
        if (err) {
            console.log(err);
        } else {
            socket.emit('DeleteMessage', true);
        }
    });
}

function SendMessage_Group(io, socket, data) {
    try {
        var msg = new Message({
            UserID: socket.Account._id,
            To: socket.Current.Data.Code,
            Author: socket.Account,
            Watched: false,
            Type: 'Text',
            CreatedDate: new Date,
            Content: data.Content
        });
        io.to(socket.Current.Data.Code).emit('MsgGroup', { Data: ViewHelper.SendMessage(msg), Destination: socket.Current.Data.Code, Author: socket.Account._id });
        GroupMember.find({ 'GroupID': socket.Current.Data._id }, (err, members) => {
            if (err) {
                console.log(err);
            } else {
                if (members) {
                    members.forEach(item => {
                        let msgItem = new Message({
                            UserID: item.UserID,
                            To: socket.Current.Data.Code,
                            Author: socket.Account,
                            Watched: false,
                            Type: 'Text',
                            CreatedDate: new Date,
                            Content: data.Content
                        });
                        msgItem.save();
                        GroupMemberDAL.PlusMessage(item._id);
                    });
                }
            }
        });
       
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    SendMessage_Friend: SendMessage_Friend,
    LoadMessages_Friend: LoadMessages_Friend,
    LoadMessages_Group: LoadMessages_Group,
    DeleteMessage: DeleteMessage,
    SendMessage_Group: SendMessage_Group,
    DeleteMessageGr: DeleteMessageGr
}