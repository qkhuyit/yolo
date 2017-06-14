var AccountDAL = require('../DataAccess/AccountDAL'),
    AccountSocket = require('./Bussiness/AccountSocket'),
    GroupSocket = require('./Bussiness/GroupSocket'),
    ViewHelper = require('../Commons/ViewHelper'),
    MessageSocket = require('./Bussiness/MessageSocket'),
    GroupDAL = require('../DataAccess/GroupDAL'),
    GroupMemberDAL = require('../DataAccess/GroupMemberDAL'),
    GroupDAL = require('../DataAccess/GroupDAL'),
    GroupMember = require('../Models/GroupMember');


module.exports = io => {
    io.on('connection', socket => {
        socket.on('Initialize', data => {
            socket.DeviceHeight = data.DeviceHeight;
            try {
                AccountDAL.FindById(data.ID).then(result => {
                    if (result) {
                        result.IsOnline = true;
                        result.SocketID = socket.id;
                        result.save();
                        socket.Account = result;
                        AccountSocket.LoadFriendRequest(socket);
                        AccountSocket.LoadNotification(socket);
                        AccountSocket.LoadFriends(socket);
                        io.emit('Online', socket.Account._id);
                        GroupMemberDAL.FindByUser(socket.Account._id).then(result => {
                            if (result) {
                                result.forEach(item => {
                                    GroupDAL.FindByID(item.GroupID).then(gr => {
                                        socket.join(gr.Code);
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
                        
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('Search', data => {
            try {
                AccountSocket.Search(socket, data);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('SendFriendRequest', data => {
            try {
                AccountSocket.SendFriendRequest(io, socket, data);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('ConfirmFriendRequest', data => {
            try {
                AccountSocket.ConfirmFriendRequest(io, socket, data);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('disconnect', () => {
            try {
                AccountDAL.Offline(socket.Account._id);
                io.sockets.emit('Offline', socket.Account._id);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('ViewNotification', () => {
            try {
                AccountSocket.ViewNotification(socket);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('CreateGroup', data => {
            try {
                GroupSocket.CreateGroup(socket, data);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('SelectFriend', data => {
            try {
                AccountDAL.FindById(data).then(acc => {
                    socket.emit('SelectFriend', ViewHelper.SelectFriend(acc, socket.DeviceHeight));
                    var current = {
                        Type: 'Friend',
                        Data: acc
                    };
                    socket.Current = current;
                    MessageSocket.LoadMessages_Friend(socket);
                    AccountSocket.ViewMessage(socket);
                });
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('SendMessage', data => {
            data.Content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            try {
                if (socket.Current.Type == 'Friend') {
                    MessageSocket.SendMessage_Friend(io, socket, data);
                } else {
                    MessageSocket.SendMessage_Group(io, socket, data);
                }
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('ViewMessage', () => {
            try {
                AccountSocket.ViewMessage(socket);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('Online', data => {
            try {
                if (socket.Current.Data._id == data) {
                    AccountDAL.FindById(data).then(result => {
                        if (result) {
                            socket.Current.Data = result;
                        }
                    }).catch(err => console.log(err));
                }
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('SelectGroup', data => {
            try {
                GroupDAL.FindByCode(data).then(result => {
                    if (result) {
                        socket.emit('SelectGroup', ViewHelper.SelectGroup(result, socket.DeviceHeight));
                        var current = {
                            Type: 'Group',
                            Data: result
                        };
                        socket.Current = current;
                        MessageSocket.LoadMessages_Group(socket);
                        GroupSocket.ViewMessage(socket);
                        GroupSocket.LoadMembers(socket);
                    }
                }).catch(err => console.log(err));
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('DeleteMessage', () => {
            try {
                MessageSocket.DeleteMessage(socket);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('ChangePassword', data => {
            try {
                AccountSocket.ChangePassword(socket, data);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('AddGroupMember', data => {
            try {
                GroupSocket.AddGroupMember(io, socket, data);
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('ViewMessage_Group', (data) => {
            try {
                GroupMember.findOne({ GroupID: socket.Current.Data._id, UserID: socket.Account._id }, (err, result) => {
                    if (result) {
                        result.Messages = 0;
                        result.save();
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('DeleteMsgGr', () => {
            try {
                MessageSocket.DeleteMessageGr(socket);
            } catch (e) {
                console.log(e);
            }
        });
    });
};