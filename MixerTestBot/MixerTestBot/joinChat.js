const Mixer = require('@mixer/client-node');
const ws = require('ws');

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
        if (heard(data, '!help') ) {
            reply(data.user_name, 'Welcome to the guild! You can do alot while you are here. Write ! followed by one of these commands to perform an action: Drink, Dance, Sing, Train, Volunteer, Attack, Defend, Inspect. Give it a try!');
            console.log(`Helped ${data.user_name}.`);
        }
        if (heard(data, '!drink')) {
            reply(data.user_name, `You take a massive swig of APPLE JUICE. Feeling pretty good.`);
            console.log(`Drank with ${data.user_name}.`);
        }
        if (heard(data, '!dance')) {
            reply(data.user_name, `You dance like your feet are on fire!`);
            console.log(`Danced with ${data.user_name}.`);
        }
        if (heard(data, '!sing')) {
            reply(data.user_name, `OOOOOOOOH, There once was a man named Sully O'Neil, who came from a town that had a windmill, he tried to climb it when along came a gust, and Sully O'Neil returned to the dust!`);
            console.log(`Sang to ${data.user_name}`);
        }
        if (heard(data, '!train')) {
            reply(data.user_name, `You go out in the back alley and start lifting crates.`);
            console.log(`Trained with ${data.user_name}.`);
        }
        if (heard(data, '!volunteer')) {
            reply(data.user_name, `You have volunteered to join a quest!`);
            console.log(`${data.user_name} joined the cause.`);
        }
        if (heard(data, '!attack')) {
            reply(data.user_name, `You flail wildly like a child. All those combat classes are really paying off!`);
            console.log(`${data.user_name} attacked!`);
        }
        if (heard(data, '!defend')) {
            reply(data.user_name, `You take a defensive stance!`);
            console.log(`${data.user_name} defended!`);
        }
        if (heard(data, '!inspect')) {
            reply(data.user_name, `You find something interesting nearby, and spend a lot of time inspecting it. Like seriously a long time. Others around you begin to look at you and wonder what exactly you are doing. But you know. You are completely enthralled by the thing you found. After closer inspection, you realize it is simply a piece of hair. Nice.`);
            console.log(`${data.user_name} inspected something.`);
        }
        if (heard(data, "!love")) {
            whisper(data.user_name, `To Sarah Mathis: You are my love, my life, my reason for living. You have supported me through thick and thin and I hope I can continue to go on this journey with you until were both old and grey. I love you and I hope you never forget it. This is my dedication to you. -Matthew Mathis`);
            console.log("Matt loves Sarah");
        }
        if (heard(data, "!montage")) {
            announce(data.user_name, `80s music begins blaring as ${data.user_name} starts their workout. Sweat dripping, legs pumping. This workout has been taken to the next level. The music cresendos as ${data.user_name} reaches their ultimate goal and completes their training! So sweet!`);
            console.log("There was a montage, it was awesome.");
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
            return socket.call('msg', ['Hi. I\'m Ussuri. I will be your guild leader for the day. Type !help to see what the guild has to offer.']);
        });
}