const _ = require('underscore');

exports.randomString = function randomString(len) {
    var possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    //_.sample will generate a combination of randomly charater from the possibleChar string into an array
    //join('') will join all elements of the array into a string.
    var str = _.sample(possibleChar, len).join('');

    return str;

};

/* Some dependencies like excel have their own fs running underneath, but somehow they do not allow us
to unlink the file which was upload to .tmp using fs.unlink, therefore, we have to delete this directory manually*/
/*exports.removeTmp = function removeTmp() {
    var tmpPath = appRoot + "/.tmp";
    var code = execSync.run("rm -r " + tmpPath);
}*/

exports.inheritPrototype = function inheritPrototype(childObject, parentObject) {
    //Copy the properties and methods from the parentObject onto the childObject​
    //So the copyOfParent object now has everything the parentObject has ​
    var copyOfParent = Object.create(parentObject.prototype);
    //Then we set the constructor of this new object to point to the childObject.​
    copyOfParent.constructor = childObject;
    //Then we set the childObject prototype to copyOfParent, so that the childObject can
    //in turn inherit everything from copyOfParent (from parentObject)​
   childObject.prototype = copyOfParent;
}

exports.inheritBaseWrapper = function inheritBaseWrapper(base) {
    function inheritBase(modelObject) {
        base.call(this, modelObject);
    }
    //Copy all methods from Base to UserResource
    this.inheritPrototype(inheritBase, base);
    return inheritBase;
}

exports.getDatePart = function getDatePart(inputDate) {
    return new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
}

exports.getTimePart = function getTimePart(inputDate) {
    return new Date(0, 0, 0, inputDate.getHours(), inputDate.getMinutes(), inputDate.getSeconds(), inputDate.getMilliseconds());
}

exports.getCurrentUTCDateTime = function getCurrentUTCDateTime() {
    var currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset());
    return currentDate;
}

exports.UTCToCurrentTimeZone = function UTCToCurrentTimeZone(inputDate) {
    var offset = (new Date()).getTimezoneOffset();
    return inputDate.setMinutes(inputDate.getMinutes() - offset);
}