router.post('/voting_award', authorize(), (req, res) => {
    let today = new Date();
    let id_award = req.body.id;
    let first_vote = req.body.first_vote;
    let second_vote = req.body.second_vote;
    let third_vote = req.body.third_vote;

    Award.findOne({
            where: {
                id: id_award
            }
        })
        .then(award => {
            if (!award) {
                res.status(400).send({ message: 'There is no award' });
            } else {
                Voter.findOne({
                        where: {
                            id_award: id_award,
                            id_user: req.decoded.id
                        }
                    })
                    .then(voter => {
                        if (!voter) {
                            res.status(400).send({ message: 'You are not allowed to vote this award' });
                        } else {
                            let data = {
                                id: id_award,
                                id_voter: req.decoded.id,
                                id_nominee_first: first_vote,
                                id_nominee_second: second_vote,
                                id_nominee_third: third_vote,
                            }

                            let token_name = 'token_' + data.id;
                            let stream_name = 'award_' + data.id;
                            let key_name1 = 'nominee_' + data.id_nominee_first;
                            let key_name2 = 'nominee_' + data.id_nominee_second;
                            let key_name3 = 'nominee_' + data.id_nominee_third;
                            //List voter
                            multichain.initiateMultichain().listStreamKeyItems({
                                    stream: stream_name,
                                    key: 'voter'
                                })
                                .then(voters => {
                                    console.log('Get list voter successfully');
                                    for (var i = 0; i < voters.length; i++) {
                                        //Get txid
                                        let txid = voters[i].txid;
                                        //Check id voter
                                        multichain.initiateMultichain().getStreamItem({
                                                stream: stream_name,
                                                txid: txid
                                            })
                                            .then(voter => {
                                                let id_voter = voter.data.json.id;
                                                if (data.id_voter == id_voter) {
                                                    let address1 = voter.data.json.address;
                                                    multichain.initiateMultichain().getAddressBalances({
                                                        address: address1
                                                    }).then(qty => {
                                                        console.log('123', qty)
                                                        console.log('987', data.id_nominee_first)
                                                        if (qty.length == 0) {
                                                            Voter.update({
                                                                vote_status: 0,
                                                                updated_at: today
                                                            }, {
                                                                where: {
                                                                    id_award: id_award,
                                                                    id_user: req.decoded.id
                                                                }
                                                            })
                                                        } else {
                                                            if (!checkVoteValid(id_award, first_vote, second_vote, third_vote)) {
                                                                res.status(400).send({ message: 'Your vote is invalid' });
                                                            } else {
                                                                multichain.grant(address1, 'receive,send');
                                                                console.log('Get info voter successfully', address1);
                                                                multichain.initiateMultichain().listStreamKeyItems({
                                                                        stream: stream_name,
                                                                        key: 'nominee'
                                                                    })
                                                                    .then(nominees => {
                                                                        console.log('Get list nominee successfully');
                                                                        for (var i = 0; i <= nominees.length; i++) {
                                                                            let txid1 = nominees[i].txid;
                                                                            multichain.initiateMultichain().getStreamItem({
                                                                                    stream: stream_name,
                                                                                    txid: txid1
                                                                                })
                                                                                .then(nominee => {
                                                                                    console.log('Get info nominee successfully');
                                                                                    let id_nominee = nominee.data.json.id;
                                                                                    let address2 = nominee.data.json.address;
                                                                                    console.log('1234', data.id_nominee_first, id_nominee)
                                                                                        //First vote
                                                                                    if (data.id_nominee_first == id_nominee) {

                                                                                        amount = 5;
                                                                                        console.log('Determined first_vote user');
                                                                                        // console.log(address1, address2, token_name, amount);
                                                                                        multichain.initiateMultichain().sendAssetFrom({
                                                                                                from: address1,
                                                                                                to: address2,
                                                                                                asset: token_name,
                                                                                                qty: amount
                                                                                            })
                                                                                            .then(() => {
                                                                                                console.log('Send token to first_vote user successfully');

                                                                                                multichain.initiateMultichain().getStreamKeySummary({
                                                                                                        stream: stream_name,
                                                                                                        key: key_name1,
                                                                                                        mode: 'jsonobjectmerge'
                                                                                                    })
                                                                                                    .then(votes => {
                                                                                                        let voteChange = votes.json.first_votes + 1;
                                                                                                        multichain.initiateMultichain().publish({
                                                                                                                stream: stream_name,
                                                                                                                key: key_name1,
                                                                                                                data: {
                                                                                                                    "json": {
                                                                                                                        "first_votes": voteChange,
                                                                                                                    }
                                                                                                                }
                                                                                                            })
                                                                                                            // , (err) => {
                                                                                                            //     if (err) {
                                                                                                            //         console.log('Error when update first_vote user');
                                                                                                            //     } else {
                                                                                                            //         console.log('Update vote for first_vote user successfully');
                                                                                                            //     }
                                                                                                            //}
                                                                                                    })
                                                                                                    .catch(err => {
                                                                                                        console.log('Error when merge votes ' + err);
                                                                                                    })
                                                                                            })
                                                                                            .catch(err => {
                                                                                                console.log('Error when send token ' + err);
                                                                                            })
                                                                                    }

                                                                                    //Second vote
                                                                                    if (data.id_nominee_second == id_nominee) {
                                                                                        amount = 3;
                                                                                        console.log('Determined second_vote user');
                                                                                        multichain.initiateMultichain().sendAssetFrom({
                                                                                                from: address1,
                                                                                                to: address2,
                                                                                                asset: token_name,
                                                                                                qty: amount
                                                                                            })
                                                                                            .then(() => {
                                                                                                console.log('Send token to second_vote user successfully');

                                                                                                multichain.initiateMultichain().getStreamKeySummary({
                                                                                                        stream: stream_name,
                                                                                                        key: key_name2,
                                                                                                        mode: 'jsonobjectmerge'
                                                                                                    })
                                                                                                    .then(votes => {
                                                                                                        let voteChange = votes.json.second_votes + 1;
                                                                                                        multichain.initiateMultichain().publish({
                                                                                                                stream: stream_name,
                                                                                                                key: key_name2,
                                                                                                                data: {
                                                                                                                    "json": {
                                                                                                                        "second_votes": voteChange,
                                                                                                                    }
                                                                                                                }
                                                                                                            }

                                                                                                        )
                                                                                                    })
                                                                                                    .catch(err => {
                                                                                                        console.log('Error when merge votes ' + err);
                                                                                                        // res.status(400).send({ message: 'Error when merge token ' });
                                                                                                    })
                                                                                            })
                                                                                            .catch(err => {
                                                                                                console.log('Error when send token ' + err);
                                                                                                //res.status(400).send({ message: 'Error when send token ' });
                                                                                            })
                                                                                    }

                                                                                    // Third_vote
                                                                                    if (data.id_nominee_third == id_nominee) {
                                                                                        amount = 1;
                                                                                        console.log('Determined third_vote user');
                                                                                        multichain.initiateMultichain().sendAssetFrom({
                                                                                                from: address1,
                                                                                                to: address2,
                                                                                                asset: token_name,
                                                                                                qty: amount
                                                                                            })
                                                                                            .then(() => {
                                                                                                console.log('Send token to third_vote user successfully');

                                                                                                multichain.initiateMultichain().getStreamKeySummary({
                                                                                                        stream: stream_name,
                                                                                                        key: key_name3,
                                                                                                        mode: 'jsonobjectmerge'
                                                                                                    })
                                                                                                    .then(votes => {
                                                                                                        let voteChange = votes.json.third_votes + 1;
                                                                                                        multichain.initiateMultichain().publish({
                                                                                                                stream: stream_name,
                                                                                                                key: key_name3,
                                                                                                                data: {
                                                                                                                    "json": {
                                                                                                                        "third_votes": voteChange,
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                            // , (err) => {
                                                                                                            //     if (err) {
                                                                                                            //         console.log('Error when update third_vote user');
                                                                                                            //     } else {
                                                                                                            //         console.log('Update vote for third_vote user successfully');
                                                                                                            //     }
                                                                                                            // }
                                                                                                        )
                                                                                                    })
                                                                                                    .catch(err => {
                                                                                                        console.log('Error when merge votes ' + err);

                                                                                                    })
                                                                                            })
                                                                                            .catch(err => {
                                                                                                console.log('Error when send token ' + err);
                                                                                                res.status(400).send({ message: 'Error when send token ' });
                                                                                            })
                                                                                    }



                                                                                })
                                                                                .catch(err => {
                                                                                    console.log('Error when get info nominee ' + err);
                                                                                    res.status(400).send({ message: 'Error when get info nominee ' });
                                                                                })
                                                                        }
                                                                    })
                                                                    .catch(err => {
                                                                        console.log('Error when get list nominee ' + err);
                                                                        res.status(400).send({ message: 'Error when get list nominee ' });
                                                                    })
                                                            }
                                                        }
                                                    })
                                                }
                                            })
                                            .catch(err => {

                                                console.log('Error when get info voter ' + err);
                                                res.status(400).send({ message: 'Error when get info voter ' });
                                            })
                                    }
                                })
                                .catch(err => {
                                    console.log('Error when get list voter ' + err);
                                    res.status(400).send({ message: 'Error when get list voter ' });
                                })
                        }
                    })
                    .catch(err => {
                        res.status(400).send({ message1: err });
                    })
            }
        })
        .catch(err => {
            res.status(400).send({ message: err });
        })
})