const { Client, OAuthProvider, ChatService, DefaultRequestRunner } = require('../');

const express = require('express');
const app = express();

/**
 * Returns a client set up to use OAuth.
 * @return {Client}
 */

function getClient() {
    const client = new Client(new DefaultRequestRunner());
    client.use(new OAuthProvider(client, {
        clientId: '543cdfdcc57b9847f58d08367c69521563dbcc559abb079d',
        secret: '60dd4a495aabbf46e2f1c8f78accc99ac83ca0b2ec099e4a821eb10886a437b6',
    }));

    return client;
}

/**
 * Returns the URL you're directing people to after they finish
 * OAuth. Right now this is set to the `/returned` route.
 * @return {String}
 */

function getRedirectUri() {
    return 'http://mysite.com:3000/returned';
}

/**
 * Users going to the index page are redirected to the main
 * Mixer site to give authorization for you to connect to chat.
 */

app.get('/', (req, res) => {
    const url = getClient().getProvider().getRedirect(getRedirectUri(), ['chat:connect']);
    res.redirect(url);
});

/**
 * They come back to the `/returned` endpoint. Auth them, then
 * you can do whatever you'd like.
 */

app.get('/returned', (req, res) => {

    const client = getClient();
    const oauth = client.getProvider();

    oauth.attempt(getRedirectUri(), req.query)
        .then(() => new ChatService(client).join(1))
        // you're authenticated!
        .then(result => {
            res.send(JSON.stringify(result));
        })

        .catch(err => {
            console.log('error authenticating:', err);
        });
});

app.listen(3000);
