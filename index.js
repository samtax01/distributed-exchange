// This RPC server will announce itself as `rpc_test`
// in our Grape Bittorrent network
// When it receives requests, it will answer with 'world'

'use strict'

const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')


const link = new Link({
    grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
    timeout: 300000
})
peer.init()

const port = 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')
service.listen(port)

setInterval(function () {
    link.announce('rpc_test', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
    console.log(payload) //  { msg: 'hello' }
    handler.reply(null, { msg: 'world' })
})


/*

// This client will as the DHT for a service called `rpc_test`
// and then establishes a P2P connection it.
// It will then send { msg: 'hello' } to the RPC server

'use strict'

const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const link = new Link({
    grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

peer.request('rpc_test', { msg: 'hello' }, { timeout: 10000 }, (err, data) => {
    if (err) {
        console.error(err)
        process.exit(-1)
    }
    console.log(data) // { msg: 'world' }
})*/
