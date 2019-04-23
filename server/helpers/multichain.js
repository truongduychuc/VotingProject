initiateMultichain = function() {
    let multichain = require("multichain-node")({
        port: 9240,
        host: '127.0.0.1',
        user: "multichainrpc",
        pass: "5sD9KgwjeyBWqyYsxVqh1b7Rmb2UfCaDkbtv3FcgLQ5g"
    });
    return multichain;
}

const multichain = initiateMultichain();

module.exports = {
    initiateMultichain,
    getInfo,
    createStream,
    subscribe,
    publish,
    //getNewAddress,
    grant,
    revoke,
    issue,
    sendAssetFrom,
    listStreamItems,
    listAssets,
    setAsset,
    sendTokenToVoter,
    setNominee
};

function getInfo() {
    multichain.getInfo((err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    })
}

function createStream(stream_name) {
    stream_name = stream_name.toString();
    multichain.create({
        type: 'stream',
        name: stream_name,
        open: false
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Create stream successfully');
        }
    })
}

function subscribe(stream_name) {
    stream_name = stream_name.toString();
    multichain.subscribe({
        stream: stream_name
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Subscribe stream successfully');
        }
    })
}

function publish(stream_name, key_name, data) {
    multichain.publish({
        stream: stream_name,
        key: key_name,
        data: {
            "json": {
                "id": data.id,
                "address": data.address
            }
        }
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Input data to stream successfully');
        }
    })
}

function setAsset(stream_name, asset_name, token_name, total_voter) {
    //Get new address
    multichain.getNewAddress()
        .then(address => {
            console.log('Get a new address for asset');
            //Grant permission for asset
            grant(address, 'receive,send');
            let asset_data = {
                id: 0,
                address: address
            }
            publish(stream_name, asset_name, asset_data);
            //Create new asset
            issue(address, token_name, total_voter * 9);
        })
        .catch(err => {
            console.log('Error when set new address ' + err);
        })
}

function sendTokenToVoter(stream_name, asset_name, token_name, id) {
    multichain.listStreamKeyItems({
            stream: stream_name,
            key: asset_name,
            verbose: true
        })
        .then(asset => {
            let asset_txid = asset[0].txid;
            console.log('123 ' + asset_txid);
            multichain.getStreamItem({
                    stream: stream_name,
                    txid: asset_txid
                })
                .then(result => {
                    //Get address of asset
                    address1 = result.data.json.address;
                    //Get new address
                    multichain.getNewAddress()
                        .then(address2 => {
                            console.log('Get new address for voter ');
                            //Grant permission for voter
                            grant(address2, 'receive,send');
                            //Save data to stream
                            let key_name1 = 'voter';
                            let voter_data = {
                                id: id,
                                address: address2
                            }
                            publish(stream_name, key_name1, voter_data);
                            //Send token to voter
                            sendAssetFrom(address1, address2, token_name, 9);
                            //Revoke permission
                            revoke(address2, 'send');
                        })
                        .catch(err => {
                            console.log('Error when send token ' + err);
                        })
                })
                .catch(err => {
                    console.log('Error when get stream item ' + err);
                })
        })
        .catch(err => {
            console.log('Error when list asset address ' + err);
        })
}

function setNominee(stream_name, id) {
    multichain.getNewAddress()
        .then(address => {
            console.log('Get new address for nominee ');
            //Grant permission for asset
            grant(address, 'receive');
            let key_name2 = 'nominee';
            let nominee_data = {
                id: id,
                address: address
            }
            publish(stream_name, key_name2, nominee_data);
        })
        .catch(err => {
            console.log('Error when set nominee ' + err);
        })
}
let stream_name = 'award_984';
let asset_name = 'asset_984';
let token_name = 'token_984';

// createStream(stream_name);
// subscribe(stream_name);
// setAsset(stream_name, asset_name, token_name, 6);
// test();
//sendTokenToVoter(stream_name, asset_name, token_name, 6);


// setNominee(stream_name, 6);

// async function test() {
//     await setAsset(stream_name, asset_name, token_name, 6);
// }

// var getNewAddress = async() => {
//         console.log("1");
//         return await multichain.getNewAddress()
//             .then(rs => {
//                 console.log('2')
//                 return rs;
//             })

//     }
// async function getNewAddress() {
//     return await multichain.getNewAddress()
//         .then(result => {
//             return result;
//         })
// }

// async function setAddress() {
//     var add = await getNewAddress();
//     console.log(1);
//     //console.log(add);
//     return add;
// }




function grant(address, permission) {
    multichain.grant({
        addresses: address,
        permissions: permission
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Grant permission successfully');
        }
    })
}

function revoke(address, permission) {
    multichain.revoke({
        addresses: address,
        permissions: permission
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Revoke permission successfully');
        }
    })
}

function issue(address, token_name, qty) {
    multichain.issue({
        address: address,
        asset: {
            name: token_name,
            open: true
        },
        qty: qty,
        units: 0.1
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Create asset successfully');
        }
    })
}

function sendAssetFrom(address1, address2, token_name, amount) {
    multichain.sendAssetFrom({
        from: address1,
        to: address2,
        asset: token_name,
        qty: amount
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Send token successfully');
        }
    })
}

function listStreamItems(stream_name) {
    multichain.listStreamItems({
            stream: stream_name,
            verbose: true
        })
        .then(list => {
            console.log(list)
            return list;
        })
        .catch(err => {
            return 'Can not list stream items' + err;
        })
}

function listAssets() {
    multichain.listAssets()
        .then(list => {
            console.log(list)
            return list;
        })
        .catch(err => {
            return 'Can not list assets' + err;
        })
}

// multichain.listStreamKeyItems({
//         stream: "award_999",
//         key: "asset_999",
//         verbose: true
//     })
//     .then(result => {
//         console.log(result)
//     })

// multichain.getStreamItem({
//         stream: 'award_999',
//         txid: 'ec3751d8ca8e197bb518633bb5161118cf88a418618f38f7a25c6de6a7637ac2'
//     })
//     .then(result => {
//         console.log(result)
//         address = result.data.json.address;
//         console.log(address)
//     })