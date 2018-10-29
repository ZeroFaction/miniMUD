let players = [];

var methods = {
// Test that all values are being committed to the array properly. For test only, to be removed in realized system. May be converted to a status request response for the user.
    checkPlayers: function () {
        console.log('Player List:');
        for (var x = 0; x < players.length; x++) {
            console.log(players[x].getStats());
        }
    },
    // Checks for existing users to prevent doubles.
    findUser: function (_userName) {
        for (var x = 0; x < players.length; x++) {
            if (players[x].getUsername() == _userName) {
                return true;
            }
        }
        return false;
    },
    addPlayer: function (player) {
        players.push(player);
    }
};

exports.methods = methods;