let playerCommands = [];
let adminCommands = [];
let adminSubCommands = [];

var methods = {
    checkPlayerCommands: function (_command) {
        if (playerCommands.indexOf(_command) != null) {
            return true;
        }
        return false;
    },
    checkAdminCommands: function (_command) {

    },
    checkAdminSubCommands: function (_subCommand) {

    }
};

exports.methods = methods;