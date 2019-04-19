let multichain = require("multichain-node")({
    port: 9240,
    host: '127.0.0.1',
    user: "multichainrpc",
    pass: "5sD9KgwjeyBWqyYsxVqh1b7Rmb2UfCaDkbtv3FcgLQ5g"
});

module.exports = {
    getInfo,
    createStream
};

function getInfo(req, res) {
    multichain.getInfo((err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    })
}

function createStream(name, req, res) {
    name = name.toString();
    multichain.create({
        type: 'stream',
        name: name,
        open: true
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Create stream successfully');
        }
    })
}