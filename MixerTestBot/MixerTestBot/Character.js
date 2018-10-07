function character(name, heroClass, level, location) {
    this.setValue(name);
    this.setValue(heroClass);
    this.setValue(level);
    this.setValue(location);
}

// Set methods.
character.method('setName', function (value) {
    this.name = value;
    return this;
});

character.method('setClass', function (value) {
    this.heroClass = value;
    return this;
});

character.method('setLevel', function (value) {
    this.level = value;
    return this;
});

character.method('setLocation', function (value) {
    this.location = value;
    return this;
});

// Get methods.
character.method('getName', function () {
    return this.name;
});

character.method('getClass', function () {
    return this.heroClass;
});

character.method('getLevel', function () {
    return this.level;
});

character.method('getLocation', function () {
    return this.location;
});

character.method('getStats', function () {
    return '(' + this.getName() + '- Level ' + this.getLevel() + ' ' + this.getClass + '. Currently at location: ' + this.getLocation + ')';
})

//Test
ladySelah = new character(Selah, Warrior, 1, 1);
console.log(ladySelah.getStats());