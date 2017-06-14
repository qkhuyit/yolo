var bcrypt = require("bcrypt");

function Hash_Password(password) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
}

function Compare_Password(password, hash) {
    return bcrypt.compareSync(password, hash);
}

function DecodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}

function SaveBase64Image(image) {
    var defer = require('q').defer();
    try {
        var imageTypeRegularExpression = /\/(.*?)$/;
        var crypto = require('crypto');
        var seed = crypto.randomBytes(20);
        var uniqueSHA1String = crypto
            .createHash('sha1')
            .update(seed)
            .digest('hex');
        var base64Data = image;

        var imageBuffer = DecodeBase64Image(base64Data);
        var userUploadedFeedMessagesLocation = 'public/uploads/decode/';
        var uniqueRandomImageName = 'image-' + uniqueSHA1String;
        var imageTypeDetected = imageBuffer
            .type
            .match(imageTypeRegularExpression);
        var userUploadedImagePath = userUploadedFeedMessagesLocation +
            uniqueRandomImageName +
            '.' +
            imageTypeDetected[1];
        try {
            require('fs').writeFile(userUploadedImagePath, imageBuffer.data,
                function () {
                    var imgPath = userUploadedImagePath.replace('public', '');
                    defer.resolve(imgPath);
                });
        }
        catch (error) {
            defer.reject(error);
            console.log('ERROR:', error);
        }
    }
    catch (error) {
        console.log('ERROR:', error);
        defer.reject(error);
    }
    return defer.promise;
}

module.exports = {
    Hash_Password: Hash_Password,
    Compare_Password: Compare_Password,
    DecodeBase64Image: DecodeBase64Image,
    SaveBase64Image: SaveBase64Image,
}
