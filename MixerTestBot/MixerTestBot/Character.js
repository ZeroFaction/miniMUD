module.exports = class Character {
    constructor(userN, charN, hClass, lvl, loc, cha, con, dex, inte, str, wis) {
        this.userName = userN;
        this.name = charN;
        this.heroClass = hClass;
        this.level = lvl;
        this.location = loc;
        this.charisma = cha;
        this.constitution = con;
        this.dexterity = dex;
        this.intelligence = inte;
        this.strength = str;
        this.wisdom = wis;

        // Setters
        this.setName = function (newName) {
            this.name = newName;
        }
        this.setLevel = function (newLevel) {
            this.level = newLevel;
        }
        this.levelUp = function (earnedLevels) {
            this.level += earnedLevels;
            UpdateStats(this.level);
        }
        this.setLocation = function (newLocation) {
            this.location = newLocation;
        }


        // Getters
        this.getUsername = function () {
            return this.userName;
        }
        this.getName = function () {
            return this.name;
        }
        this.getLocation = function () {
            return this.location;
        }
        this.getStats = function () {
            return 'For user: ' + this.userName + '. ' + this.name + ' is a level ' + this.level + ' ' + this.heroClass + '. Currently at location ID: ' + this.location + '.';
        }
    }
}

function UpdateStats(statLevel) {

}

