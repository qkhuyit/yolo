var Notification = require('../Models/Notification'),
    q = require('q');

function Create(notification) {
    var defer = q.defer();
    notification = new Notification(notification);
    Notification.create(notification, (err, result) => {
        if (err) {
            defer.reject(err);
        } else {
            if (result) {
                defer.resolve(result)
            } else {
                defer.resolve(null);
            }
        }
    });
    return defer.promise;
}

function FindNotificationByUser(id) {
    var defer = q.defer();
    Notification.find({ 'To': id, 'Status': false }, (err, result) => {
        if (err) {
            defer.reject(err);
        } else {
            if (result) {
                defer.resolve(result);
            } else {
                defer.resolve(null);
            }
        }
    });
    return defer.promise;
}

function ViewNotification(toId) {
    Notification.find({ 'To': toId }, (err, result) => {
        if (result) {
            result.forEach(item => {
                item.Status = true;
                item.save();
            });
        }
    });
}

module.exports = {
    Create: Create,
    FindNotificationByUser: FindNotificationByUser,
    ViewNotification: ViewNotification
}