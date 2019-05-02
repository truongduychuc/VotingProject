initiateMultichain = function() {
    let multichain = require("multichain-node")({
        port: 9736,
        host: '127.0.0.1',
        user: "multichainrpc",
        pass: "GLn6pJfAu2aFQrdJVh9XmtFFng9NHw7WukCLyGSqZSgQ"
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
    publishEmployee,
    //getNewAddress,
    grant,
    revoke,
    issue,
    sendAssetFrom,
    listStreamItems,
    listAssets,
    setAsset,
    sendTokenToVoter,
    setNominee,
    setNomineeVote,
    addNomineeVote,
    grantC
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

function publishEmployee(stream_name, key_name, data) {
    multichain.publish({
        stream: stream_name,
        key: key_name,
        data: {
            "json": {
                "id": data.id,
                "first_name": data.first_name,
                "last_name": data.last_name,
                "english_name": data.english_name,
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

function setNominee(stream_name, data) {
    multichain.getNewAddress()
        .then(address => {
            console.log('Get new address for nominee ');
            //Grant permission for asset
            grant(address, 'receive');
            let key_name2 = 'nominee';
            let nominee_data = {
                id: data.id,
                first_name: data.first_name,
                last_name: data.last_name,
                english_name: data.english_name,
                address: address
            }
            publishEmployee(stream_name, key_name2, nominee_data);
        })
        .catch(err => {
            console.log('Error when set nominee ' + err);
        })
}

function setNomineeVote(stream_name, data) {
    let key_name = 'nominee_' + data.id
    multichain.publish({
        stream: stream_name,
        key: key_name,
        data: {
            "json": {
                "first_votes": 0,
                "second_votes": 0,
                "third_votes": 0,
            }
        }
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Set nominee vote successfully');
        }
    })
}

let data = {
    id: 175,
    id_voter: 9
}

function test() {
    console.log(getVoterInfo(data));
    if (getVoterInfo(data)) {
        console.log('true');
    } else {
        console.log('false');
    }
}
//test();

function getVoterInfo(data) {
    let stream_name = 'award_' + data.id;
    multichain.listStreamKeyItems({
            stream: stream_name,
            key: 'voter'
        })
        .then(voters => {
            console.log('Get list voter successfully');
            for (var i = 0; i < voters.length; i++) {
                //Get txid
                let txid = voters[i].txid;
                //Check id voter
                multichain.getStreamItem({
                        stream: stream_name,
                        txid: txid
                    })
                    .then(voter => {
                        let id_voter = voter.data.json.id;
                        if (data.id_voter == id_voter) {
                            let address = voter.data.json.address;
                            multichain.getAddressBalances({
                                    address: address
                                })
                                .then(data => {
                                    console.log(data)
                                    if (!data) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                })
                                .catch(err => {
                                    console.log('Error when get info voter ' + err);
                                })
                        }
                    })
                    .catch(err => {
                        console.log('Error when get info voter ' + err);
                    })
            }
        })
        .catch(err => {
            console.log('Error when get list voter ' + err);
        })
}

function addNomineeVote(data, res) {
    // let token_name = 'token_' + data.id;
    // let stream_name = 'award_' + data.id;
    // let key_name1 = 'nominee_' + data.id_nominee_first;
    // let key_name2 = 'nominee_' + data.id_nominee_second;
    // let key_name3 = 'nominee_' + data.id_nominee_third;
    // //List voter
    // multichain.listStreamKeyItems({
    //         stream: stream_name,
    //         key: 'voter'
    //     })
    //     .then(voters => {
    //         console.log('Get list voter successfully');
    //         for (var i = 0; i < voters.length; i++) {
    //             //Get txid
    //             let txid = voters[i].txid;
    //             //Check id voter
    //             multichain.getStreamItem({
    //                     stream: stream_name,
    //                     txid: txid
    //                 })
    //                 .then(voter => {
    //                     let id_voter = voter.data.json.id;
    //                     if (data.id_voter == id_voter) {
    //                         let address1 = voter.data.json.address;
    //                         grant(address1, 'receive,send');
    //                         console.log('Get info voter successfully', address1);
    //                         multichain.listStreamKeyItems({
    //                                 stream: stream_name,
    //                                 key: 'nominee'
    //                             })
    //                             .then(nominees => {
    //                                 console.log('Get list nominee successfully');
    //                                 for (var i = 0; i < nominees.length; i++) {
    //                                     let txid1 = nominees[i].txid;
    //                                     multichain.getStreamItem({
    //                                             stream: stream_name,
    //                                             txid: txid1
    //                                         })
    //                                         .then(nominee => {
    //                                             console.log('Get info nominee successfully');
    //                                             let id_nominee = nominee.data.json.id;
    //                                             let address2 = nominee.data.json.address;
    //                                             //First vote
    //                                             // if (data.id_nominee_first == id_nominee) {
    //                                             //     amount = 5;
    //                                             //     console.log('Determined first_vote user');
    //                                             //     // console.log(address1, address2, token_name, amount);
    //                                             //     multichain.sendAssetFrom({
    //                                             //             from: address1,
    //                                             //             to: address2,
    //                                             //             asset: token_name,
    //                                             //             qty: amount
    //                                             //         })
    //                                             //         .then(() => {
    //                                             //             console.log('Send token to first_vote user successfully');
    //                                             //             multichain.getStreamKeySummary({
    //                                             //                     stream: stream_name,
    //                                             //                     key: key_name1,
    //                                             //                     mode: 'jsonobjectmerge'
    //                                             //                 })
    //                                             //                 .then(votes => {
    //                                             //                     let voteChange = votes.json.first_votes + 1;
    //                                             //                     multichain.publish({
    //                                             //                             stream: stream_name,
    //                                             //                             key: key_name1,
    //                                             //                             data: {
    //                                             //                                 "json": {
    //                                             //                                     "first_votes": voteChange,
    //                                             //                                 }
    //                                             //                             }
    //                                             //                         })
    //                                             //                         // , (err) => {
    //                                             //                         //     if (err) {
    //                                             //                         //         console.log('Error when update first_vote user');
    //                                             //                         //     } else {
    //                                             //                         //         console.log('Update vote for first_vote user successfully');
    //                                             //                         //     }
    //                                             //                         //}
    //                                             //                 })
    //                                             //                 .catch(err => {
    //                                             //                     console.log('Error when merge votes ' + err);
    //                                             //                 })
    //                                             //         })
    //                                             //         .catch(err => {
    //                                             //             console.log('Error when send token ' + err);
    //                                             //         })
    //                                             // }

    //                                             //Second vote
    //                                             if (data.id_nominee_second == id_nominee) {
    //                                                 amount = 3;
    //                                                 console.log('Determined second_vote user');
    //                                                 multichain.sendAssetFrom({
    //                                                         from: address1,
    //                                                         to: address2,
    //                                                         asset: token_name,
    //                                                         qty: amount
    //                                                     })
    //                                                     .then(() => {
    //                                                         console.log('Send token to second_vote user successfully');
    //                                                         multichain.getStreamKeySummary({
    //                                                                 stream: stream_name,
    //                                                                 key: key_name2,
    //                                                                 mode: 'jsonobjectmerge'
    //                                                             })
    //                                                             .then(votes => {
    //                                                                 let voteChange = votes.json.second_votes + 1;
    //                                                                 multichain.publish({
    //                                                                         stream: stream_name,
    //                                                                         key: key_name2,
    //                                                                         data: {
    //                                                                             "json": {
    //                                                                                 "second_votes": voteChange,
    //                                                                             }
    //                                                                         }
    //                                                                     }

    //                                                                 )
    //                                                             })
    //                                                             .catch(err => {
    //                                                                 console.log('Error when merge votes ' + err);
    //                                                                 res.status(400).send({ message: 'Error when merge token ' });
    //                                                             })
    //                                                     })
    //                                                     .catch(err => {
    //                                                         console.log('Error when send token ' + err);
    //                                                         res.status(400).send({ message: 'Error when send token ' });
    //                                                     })
    //                                             }

    //                                             // Third_vote
    //                                             // if (data.id_nominee_third == id_nominee) {
    //                                             //     amount = 1;
    //                                             //     console.log('Determined third_vote user');
    //                                             //     multichain.sendAssetFrom({
    //                                             //             from: address1,
    //                                             //             to: address2,
    //                                             //             asset: token_name,
    //                                             //             qty: amount
    //                                             //         })
    //                                             //         .then(() => {
    //                                             //             console.log('Send token to third_vote user successfully');
    //                                             //             multichain.getStreamKeySummary({
    //                                             //                     stream: stream_name,
    //                                             //                     key: key_name3,
    //                                             //                     mode: 'jsonobjectmerge'
    //                                             //                 })
    //                                             //                 .then(votes => {
    //                                             //                     let voteChange = votes.json.third_votes + 1;
    //                                             //                     multichain.publish({
    //                                             //                             stream: stream_name,
    //                                             //                             key: key_name3,
    //                                             //                             data: {
    //                                             //                                 "json": {
    //                                             //                                     "third_votes": voteChange,
    //                                             //                                 }
    //                                             //                             }
    //                                             //                         }
    //                                             //                         // , (err) => {
    //                                             //                         //     if (err) {
    //                                             //                         //         console.log('Error when update third_vote user');
    //                                             //                         //     } else {
    //                                             //                         //         console.log('Update vote for third_vote user successfully');
    //                                             //                         //     }
    //                                             //                         // }
    //                                             //                     )
    //                                             //                 })
    //                                             //                 .catch(err => {
    //                                             //                     console.log('Error when merge votes ' + err);

    //                                             //                 })
    //                                             //         })
    //                                             //         .catch(err => {
    //                                             //             console.log('Error when send token ' + err);
    //                                             //             res.status(400).send({message: 'Error when send token ' });
    //                                             //         })
    //                                             // }

    //                                         })
    //                                         .catch(err => {
    //                                             console.log('Error when get info nominee ' + err);
    //                                             res.status(400).send({ message: 'Error when get info nominee ' });
    //                                         })
    //                                 }
    //                             })
    //                             .catch(err => {
    //                                 console.log('Error when get list nominee ' + err);
    //                                 res.status(400).send({ message: 'Error when get list nominee ' });
    //                             })
    //                     }
    //                 })
    //                 .catch(err => {

    //                     console.log('Error when get info voter ' + err);
    //                     res.status(400).send({ message: 'Error when get info voter ' });
    //                 })
    //         }
    //     })
    //     .catch(err => {

    //         console.log('Error when get list voter ' + err);
    //         res.status(400).send({ message: 'Error when get list voter ' });
    //     })

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

function grantC(address, permission) {
    multichain.grant({
        addresses: address,
        permissions: permission
    })
}


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