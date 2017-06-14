var Group = require('../../Models/Group'),
    GroupMember = require('../../Models/GroupMember'),
    GroupDAL = require('../../DataAccess/GroupDAL'),
    GroupMemberDAL = require('../../DataAccess/GroupMemberDAL'),
    ViewHelper = require('../../Commons/ViewHelper'),
    Account = require('../../Models/Account'),
    AccountDAL = require('../../DataAccess/AccountDAL');

module.exports = {
    CreateGroup: (socket, group) => {
        var newGr = {
            Name: group.Name,
            Description: group.Description,
            Avatar: group.Avatar,
            Admin: socket.Account,
            Code: group.Code
        };
        GroupDAL.FindByCode(newGr.Code).then(gr => {
            if (gr) {
                socket.emit('CreateGroup', { Status: false, Message: 'Mã nhóm đã được sử dụng.', Data: null });
            } else {
                GroupDAL.Create(newGr).then(result => {
                    if (result) {
                        var ngrMem = {
                            GroupID: result._id,
                            UserID: socket.Account._id,
                            Active: true,
                            Messages: 0
                        }
                        GroupMemberDAL.Create(ngrMem).then(grMem => {
                            socket.emit('CreateGroup', { Status: true, Message: 'Tạo nhóm thành công.', Data: ViewHelper.GroupItem(result, false) });
                        });
                    } else {
                        socket.emit('CreateGroup', { Status: false, Message: 'Tạo nhóm không thành công.', Data: null });
                    }
                }).catch(err => console.log(err));
            }
        }).catch(err => console.log(err));
    },

    LoadGroups: socket => {
        GroupMemberDAL.FindByUser(socket.Account._id).then(result => {
            if (result) {
                result.forEach(item => {
                    GroupDAL.FindByID(item.GroupID).then(gr => {
                        if (gr) {
                            if (item.Messages == 0) {
                                socket.emit('LoadGroups', ViewHelper.GroupItem(gr, false));
                            } else {
                                socket.emit('LoadGroups', ViewHelper.GroupItem(gr, true));
                            }
                        }
                    })
                });
            }
        });
    },

    ViewMessage: socket => {
        GroupMember.findOne({ 'GroupID': socket.Current.Data._id, 'UserID': socket.Account._id }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    result.Messages = 0;
                    result.save();
                }
            }
        });
    },

    LoadMembers: socket => {
        GroupMember.find({ 'GroupID': socket.Current.Data._id }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    result.forEach(item => {
                        if (item.Active == true) {
                            Account.findOne({ '_id': item.UserID }, (err, acc) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (acc) {
                                        if (`${acc._id}` == `${socket.Current.Data.Admin._id}`) {
                                            socket.emit('LoadMembers', ViewHelper.GroupMember(acc, true));
                                        }
                                        else {
                                            socket.emit('LoadMembers', ViewHelper.GroupMember(acc, false));
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    },

    AddGroupMember: (io, socket, data) => {
        AccountDAL.FindByEmail(data).then(result => {
            if (result) {
                var grMem = new GroupMember({
                    GroupID: socket.Current.Data._id,
                    UserID: result._id,
                    Active: true,
                    Messages: 0
                });
                grMem.save();
                io.to(socket.Current.Data.Code).emit('LoadMembers', ViewHelper.GroupMember(result, false));
                socket.emit('AddGroupMember', { Status: true, Message: 'Đã thêm.' });
                var notifi = {
                    Author: socket.Account,
                    Content: "Đã thêm bạn vào nhóm " + socket.Current.Data.Name,
                    Status: false,
                    CreatedDate: new Date,
                    To: result._id
                };
                NotificationDAL.Create(notifi).then(reNoti => {
                    if (reNoti) {
                        if (result.IsOnline == true) {
                            io.to(result.SocketID).emit('Notification', ViewHelper.Notification(reNoti));
                            io.to(result.SocketID).emit('LoadGroups', ViewHelper.GroupItem(socket.Current.Data, false));
                        }
                    }
                });
            } else {
                socket.emit('AddGroupMember', { Status: false, Message: 'Không tìm thấy người dùng phù hợp nào.' });
            }
        }).catch(err => console.log(err));
    },
}