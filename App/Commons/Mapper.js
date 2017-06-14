var Helper = require('./Helper');

module.exports = {
    Account_Model: obj => {
        var account = {
            Email: obj.Email,
            Mobile: obj.Mobile,
            FirstName: obj.FirstName,
            LastName: obj.LastName,
            City: '',
            Address: obj.Address,
            Sex: obj.Sex,
            BirthDate: obj.BirthDate,
            Password: Helper.Hash_Password(obj.Password),
            SocketID: '',
            IsOnline: false,
            Avatar: '/images/seed/avatar/avatar.png',
            ConverPhoto: '/images/seed/avatar/conver.jpg',
            Status: true,
            LastLogin : null
        };
        return account;
    }
}