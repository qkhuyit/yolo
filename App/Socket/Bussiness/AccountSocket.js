var AccountDAL = require('../../DataAccess/AccountDAL'),
    ViewHelper = require('../../Commons/ViewHelper'),
    FriendDAL = require('../../DataAccess/FriendDAL'),
    NotificationDAL = require('../../DataAccess/NotificationDAL'),
    Helper = require('../../Commons/Helper');



module.exports = {
    Search: (socket, data) => {
        try {
            AccountDAL.FindByEmail(data).then(account => {
                if (account) {
                    FriendDAL.FindFriend(socket.Account._id, account._id).then(friend => {
                        if (friend) {
                            if (friend.Status == true) {
                                var content = ViewHelper.SearchView(account, 2);
                                socket.emit('Search', { Status: true, Data: content });
                            } else {
                                var content = ViewHelper.SearchView(account, 1);
                                socket.emit('Search', { Status: true, Data: content });
                            }
                        } else {
                            var content = ViewHelper.SearchView(account, 0);
                            socket.emit('Search', { Status: true, Data: content });
                        }
                    }).catch(err => console.log(err));
                } else {
                    socket.emit('Search', { Status: false, Data: null });
                }
            }).catch(err => console.log(err));
        } catch (e) {
            console.log(e);
        }
    },

    SendFriendRequest: (io, socket, data) => {
        AccountDAL.FindById(data).then(account => {
            FriendDAL.FindFriend(account._id, socket.Account._id).then(friend => {
                if (friend) {
                    socket.emit('SendFriendRequest', { Message: 'Bạn đã gửi yêu cầu kết bạn cho người này trước đây và đang chờ phản hồi !!!', Status: 'Warning' });
                } else {
                    var newFriend = {
                        UserID: account._id,
                        FriendID: socket.Account._id,
                        Status: false,
                        CreatedDate: new Date,
                        MessageCount: 0
                    };
                    FriendDAL.Create(newFriend).then(result => {
                        if (result) {
                            socket.emit('SendFriendRequest', { Message: 'Đã gửi yêu cầu kết bạn !!!', Status: 'Success' });
                            if (account.IsOnline == true) {
                                io.to(account.SocketID).emit('FriendRequest', ViewHelper.FriendRequest(account, result));
                            }
                        }
                    }).catch(err => console.log(err));
                }
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    },

    LoadFriendRequest(socket) {
        FriendDAL.FindRequestByUser(socket.Account._id).then(requests => {
            if (requests) {
                requests.forEach(item => {
                    AccountDAL.FindById(item.FriendID).then(account => {
                        socket.emit('FriendRequest', ViewHelper.FriendRequest(account, item));
                    }).catch(err => console.log(err));
                });
            }
        }).catch(err => console.log(err));
    },

    ConfirmFriendRequest: (io, socket, data) => {
        FriendDAL.FindByID(data).then(friend => {
            friend.Status = true;
            friend.save();
            var newFriend = {
                UserID: friend.FriendID,
                FriendID: socket.Account._id,
                Status: true,
                MessageCount: 0,
                CreatedDate: new Date
            }
            FriendDAL.Create(newFriend).then(newFr => {
                if (newFr) {
                    var notifi = {
                        Author: socket.Account,
                        Content: "Đã chấp nhận yêu cầu kết bạn của bạn",
                        Status: false,
                        CreatedDate: new Date,
                        To: friend.FriendID
                    };

                    NotificationDAL.Create(notifi).then(result => {
                        if (result) {
                            AccountDAL.FindById(result.To).then(account => {
                                if (account.IsOnline == true) {
                                    io.to(account.SocketID).emit('Notification', ViewHelper.Notification(result));
                                    socket.emit('LoadFriends', ViewHelper.FriendItem(account, false));
                                    io.to(account.SocketID).emit('LoadFriends', ViewHelper.FriendItem(socket.Account, false));
                                }
                            });
                        }
                    });
                }
            }).catch(err => console.log(err));
        });
    },

    LoadNotification: socket => {
        NotificationDAL.FindNotificationByUser(socket.Account._id).then(notifications => {
            if (notifications) {
                notifications.forEach(item => {
                    socket.emit('Notification', ViewHelper.Notification(item));
                });
            }
        }).catch(err => console.log(err));
    },

    LoadFriends: socket => {
        try {
            FriendDAL.FindAllByUser(socket.Account._id).then(friends => {
                if (friends) {
                    friends.forEach(item => {
                        AccountDAL.FindById(item.FriendID).then(friend => {
                            if (friend) {
                                if (item.MessageCount == 0) {
                                    socket.emit('LoadFriends', ViewHelper.FriendItem(friend, false));
                                } else {
                                    socket.emit('LoadFriends', ViewHelper.FriendItem(friend, true));
                                }
                            }
                        }).catch(err => console.log(err));
                    });
                }
            });
        } catch (e) {
            console.log(e);
        }
    },

    ViewNotification: socket => {
        NotificationDAL.ViewNotification(socket.Account._id);
    },

    SelectFriend: (socket, id) => {
        try {

        } catch (e) {
            console.log(e);
        }
    },

    ViewMessage: socket => {
        try {
            FriendDAL.ViewMessage(socket.Account._id, socket.Current.Data._id);
        } catch (e) {

        }
    },

    ChangePassword: (socket, data) => {
        try {
            if (data.Pass === '' || data.NewPass === '' || data.RePass === '') {
                socket.emit('ChangePassword', { Status: false, Message: 'Vui lòng nhập đầy đủ dữ liệu.' });
            } else if (data.NewPass != data.RePass) {
                socket.emit('ChangePassword', { Status: false, Message: 'Mật khẩu mới và xác nhận mật khẩu không đúng.' });
            } else {
                AccountDAL.FindById(socket.Account._id).then(result => {
                    var pass = Helper.Hash_Password(data.Pass);
                    if (Helper.Compare_Password(data.Pass, result.Password)) {
                        AccountDAL.ChangePassword(result._id, Helper.Hash_Password(data.NewPass));
                        socket.emit('ChangePassword', { Status: true, Message: 'Mật khẩu đã được thay đổi.' });
                    } else {
                        socket.emit('ChangePassword', { Status: false, Message: 'Mật khẩu không chính xác.' });
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}