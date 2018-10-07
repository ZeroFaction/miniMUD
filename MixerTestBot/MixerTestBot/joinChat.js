const Mixer = require('@mixer/client-node');
const ws = require('ws');
var m1 = 0;
var m2 = 0;
var m3 = 0;
var m4 = 0;
var m5 = 0;

let userInfo;
var commands = [];

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

function createChatSocket(userId, channelId, endpoints, authkey) {
    // Chat connection
    const socket = new Mixer.Socket(ws, endpoints).boot();

    // Greet a joined user
    socket.on('UserJoin', data => {
        socket.call('msg', [`Hi @${data.username}! Welcome to the guild! Write !help to see what you can do.`]);
    });


    // React to our !pong command
    socket.on('ChatMessage', data => {

        // Old method of retrieving chat messages. Saved for comparison.
        //if (data.message.message[0].data.toLowerCase().startsWith('!help')) {
        //    socket.call('msg', [`@${data.user_name} Welcome to the guild! You can do alot while you are here. Type ! followed by one of these commands to perform an action: Drink, Dance, Sing, Train, Volunteer, Attack, Defend, Inspect. Give it a try!`]);
        //    console.log(`Helped ${data.user_name}.`);
        //}

        //if (commands.indexOf(data.message.message[0].data.datatoLowerCase()) >= 0) {
        //    console.log(data.message.message[0].datatoLowerCase() + ' is in the command array already.');
        //} else {
        //    commands.push(data.message.message[0].data.toLowerCase());
        //    console.log('Added ' + data.message.message[0].datatoLowerCase() + ' to the command array.');
        //}

        // Tests for reply types.
        if (heard(data, '!whisper')) {
            whisper(data.user_name, 'Yo');
            console.log(`Tested ${data.user_name}.`);
        }
        if (heard(data, '!announce')) {
            announce(data.user_name, 'Yo');
            console.log(`Tested ${data.user_name}.`);
        }
        if (heard(data, '!reply')) {
            reply(data.user_name, 'Yo');
            console.log(`Tested ${data.user_name}.`);
        }

        // Basic replys for testing.
        if (heard(data, '!guildboard')) {
            whisper(data.user_name, 'Hey ' + data.user_name + '. Thanks for checking the board. Here is what we have available at the moment:');
            if (m1 < 100) {
                whisper(data.user_name, `We need info regarding the whereabouts of a missing child. !child to help out.`);
            }
            
            if (m2 < 100) {
                whisper(data.user_name, `There is a pack of rats destroying all the grain in the local silos. !rats to help eliminate them.`);
            }
            
            if (m3 < 100) {
                whisper(data.user_name, `A merchant was looking for some help transporting goods. !merchant to help the merchant.`);
            }
           
            if (m4 < 100) {
                whisper(data.user_name, `Some thugs are harassing tourists on main street. !thugs to go convince them to leave.`);
            }
        
            if (m5 < 100) {
                whisper(data.user_name, `The guild coffers are running low. !gold to go earn some cold hard, gold coins.`);
            }

            console.log(`${data.user_name} checked the mission board.`);
        }
        if (heard(data, '!child') && m1 < 100) {
            whisper(data.user_name, `You spend some time searching around town for the child.`);
            m1 += 3;
            console.log(`${data.user_name} searched for the child. Progress: ` + m1);
            if (m1 >= 100) {
                reply(data.user_name, `Followed up on some useful hints and found the missing child!`);
            }
        }
        if (heard(data, '!rats') && m2 < 100) {
            whisper(data.user_name, `You head to the silos and begin slaughtering rats.`);
            m2 += 10;
            console.log(`${data.user_name} killed some rats. Progress: ` + m2);
            if (m2 >= 100) {
                reply(data.user_name, `Finished off the last of the filthy rats.`);
            }
        }
        if (heard(data, '!merchant') && m3 < 100) {
            whisper(data.user_name, `You assist the merchant for a while. There is a lot of work to do.`);
            m3 += 7;
            console.log(`${data.user_name} assisted the merchant. Progress: ` + m3);
            if (m3 >= 100) {
                reply(data.user_name, `Moved the last bit of goods for the merchant.`);
            }
        }
        if (heard(data, '!thugs') && m4 < 100) {
            whisper(data.user_name, `You find the thugs and begin to educate them about proper manners.`);
            m4 += 1;
            console.log(`${data.user_name} had words with the thugs. Progress: ` + m4);
            if (m4 >= 100) {
                reply(data.user_name, `Convinced the last thug to change jobs.`);
            }
        }
        if (heard(data, '!gold') && m5 < 100) {
            whisper(data.user_name, `You spend some time looking for odd jobs to help fill the guild coffers.`);
            m5 += 1;
            console.log(`${data.user_name} helped fill the guild coffers. Progress: ` + m5);
            if (m5 >= 100) {
                reply(data.user_name, `Placed the last coin in the guild coffers. Great job!`);
            }
        }
    });

    function reply (userName, message) {
        socket.call('msg', [`@${userName} ` + message]);
    }

    function whisper (userName, message) {
        socket.call('whisper', [userName, ' ' + message]);
    }

    function announce (userName, message) {
        socket.call('msg', [message]);
    }

    function heard (data, test_value) {
        if (data.message.message[0].data.toLowerCase().startsWith(test_value)) {
            console.log(data.message.message[0].data);
            return true;
        }
        return false;
    }

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