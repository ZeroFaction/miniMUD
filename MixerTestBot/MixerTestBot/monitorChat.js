const Mixer = require('@mixer/client-node');
const ws = require('ws');
const pCharacter = require('./character.js');
const qManager = require('./questManager.js');
const gManager = require('./guildManager.js');
const cManager = require('./commandManager.js');

let userInfo;

const client = new Mixer.Client(new Mixer.DefaultRequestRunner());

// With OAuth we don't need to log in. The OAuth Provider will attach
// the required information to all of our requests after this call.
client.use(new Mixer.OAuthProvider(client, {
    tokens: {
        access: 'bz6E7vA3HD2M58P6uzqeIar5mklGxz9nTLk7YR3odkS4VlxJe5gSbW8w4v8NGzOk',
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
}));

// Gets the user that the Access Token we provided above belongs to.
client.request('GET', 'users/current')
    .then(response => {
        userInfo = response.body;
        return new Mixer.ChatService(client).join(response.body.channel.id);
    })
    .then(response => {
        const body = response.body;
        return createChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey);
    })
    .catch(error => {
        console.error('Something went wrong.');
        console.error(error);
    });

/**
* Creates a Mixer chat socket and sets up listeners to various chat events.
* @param {number} userId The user to authenticate as
* @param {number} channelId The channel id to join
* @param {string[]} endpoints An array of endpoints to connect to
* @param {string} authkey An authentication key to connect with
* @returns {Promise.<>}
*/

// Initialize the tasks available to the players in this session. Pass an integer value for the number of tasks to initialize.
let taskList = qManager.methods.initializeTasks(5);

function createChatSocket(userId, channelId, endpoints, authkey) {
    console.log('Created a chat socket.');
    // Chat connection
    const socket = new Mixer.Socket(ws, endpoints).boot();

    // Sends a shoutout @User message in the chat.
    function reply(userName, message) {
        socket.call('msg', [`@${userName} ` + message]);
    }

    // Returns a private message to the user who called the command.
    function whisper(userName, message) {
        socket.call('whisper', [userName, ' ' + message]);
    }

    // Replys to the entire channel.
    function announce(userName, message) {
        socket.call('msg', [message]);
    }

    // Checks the first word in a user sent message.
    function heard(data, test_value) {
        var word = data.message.message[0].data.split(' ')[0];
        console.log("Heard: " + word);
        if (word.toLowerCase() == test_value) {
            return true;
        }
        return false;
    }

    function alsoHeard(data, test_value) {
        var word = data.message.message[0].data.split(' ')[1];
        console.log("Also heard: " + word);
        if (word != null && word.toLowerCase() == test_value) {
            return true;
        }
        return false;
    }

    // Greet a joined user
    socket.on('UserJoin', data => {
        console.log("A user joined the session: " + data.username);
        socket.call('msg', [`Hi @${data.username}! Welcome to the guild! Write !help to see what you can do.`]);
    });

    // Respond to user messages.
    socket.on('ChatMessage', data => {
        var words = [];
        var primary = '';
        var secondary = '';
        var tertiary = '';
        words = data.message.message[0].data.split(' ');
        primary = words[0].toLowerCase();
        if (words[1] != null) {
            secondary = words[1].toLowerCase();
        }
        if (words[2] != null) {
            tertiary = words[2].toLowerCase();
        }
        
        // Ignore all non ! messages.
        if (primary[0] == '!') {
            // Verfiy commands are comming from a user that is not hosting the BOT AND that the command passed is valid.
            if (data.user_id != userInfo.id && cManager.methods.checkPlayerCommands(primary)) {
                // PUBLIC COMMANDS (Available to any user at any time.)
                if (primary == '!join') {
                    // Exclusion to prevent users from joining twice. This is currently bugged and always returns -1.
                    if (gManager.methods.findUser(data.user_name) == false) {
                        var myChar = new pCharacter(data.user_name, 'TestName', 'TestClass', 1, 0, 10, 10, 10, 10, 10, 10);
                        gManager.methods.addPlayer(myChar);
                        console.log('Added a new player to the guild.');
                        gManager.methods.checkPlayers();
                    }
                }

                // Tests for reply types.
                if (primary == '!whisper') {
                    whisper(data.user_name, 'Yo I can whisper, tee he he');
                    console.log(`Tested ${data.user_name}.`);
                }
                if (primary == '!announce') {
                    announce(data.user_name, 'Yo! EVERYONE CAN HEAR THIS!');
                    console.log(`Tested ${data.user_name}.`);
                }
                if (primary == '!reply') {
                    reply(data.user_name, 'Yo, what\'s good?');
                    console.log(`Tested ${data.user_name}.`);
                }

                // RESTRICTED COMMANDS (User must !join before they can access these commands.)
                if (gManager.methods.findUser(data.user_name) == true) {
                    if (primary == '!guildboard') {
                        whisper(data.user_name, 'Hey ' + data.user_name + '. Thanks for checking the board. Here is what we have available at the moment:');
                        // Contact the questManager and get descriptions from each available quest including their progress.
                        var tasks = qManager.methods.getAvailableTasks();
                        for (var x = 0; x < tasks.length; x++) {
                            whisper(data.user_name, tasks[x]);
                        }
                        console.log(`${data.user_name} checked the mission board.`);
                    }

                    // Verify there is an active task for this command.
                    if (taskList.indexOf(primary) != -1) {
                        // Do somethign related to the active task.
                        console.log("Successfully found task: " + primary);
                    }
                }
            } else if (data.user_id == userInfo.id) {
                // ADMIN COMMANDS (These commands are restricted to the entity running the bot.)
                if (primary == '!guild') {
                    console.log('Admin command accessed: Guild');
                    if (secondary == 'members') {
                        gManager.methods.checkPlayers();
                    }
                    if (secondary == 'initTasks') {
                        if (tertiary = '' || typeof tertiary != 'number') {
                            tertiary = 5;
                        }
                        qManager.methods.initializeTasks(tertiary);
                    }
                }
            }
        }    
    });

    // Handle errors
    socket.on('error', error => {
        console.error('Socket error');
        console.error(error);
    });

    return socket.auth(channelId, userId, authkey)
        .then(() => {
            console.log('Login successful');
            return socket.call('msg', ['The guild hall is open for busines! Check out the !GuildBoard for current guild tasks available.']);
        });
}