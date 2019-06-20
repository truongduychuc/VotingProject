router.post('/create', (req, res) => {
    const today = new Date();
    const year = today.getFullYear();
    const awardData = {
        type: req.body.type,
        description: null,
        year: req.body.year,
        status: 1,
        date_start: req.body.date_start,
        date_end: req.body.date_end,
        prize: req.body.prize,
        item: req.body.item,
        created_at: today,
        updated_at: today
    }
    const voterData = {
        id_award: null,
        id_user: null,
        vote_status: 1,
        updated_at: today
    }
    const nomineeData = {
        id_award: null,
        id_team: null,
        id_nominee: null,
        updated_at: today
    }

    const nomineeVotes = {
        id_award: null,
        rank: null,
        id_nominee: null,
        first_votes: 0,
        second_votes: 0,
        third_votes: 0,
        percent: 0,
        total_points: 0,
        updated_at: today
    }

    // function checkDateinput() {
    //     if (req.body.date_start > req.body.date_end) {
    //         res.status(400).send({ message: 'Date end must be greater than date start' });
    //         return false;
    //     } else {
    //         var con = moment(req.body.date_start).isBefore(today);
    //         if (con) {
    //             res.status(400).send({ message: 'Date start must be greater than today' });
    //             return false;
    //         } else {
    //             return true;
    //         }
    //     }
    // }

    //Check year and name for award

    // multichain.initiateMultichain().listStreamKeyItems({
    //     stream: "award_150",
    //     key: "nominee_1",
    //     verbose: true
    // })

    // if ((req.body.year < (year - 1)) || (req.body.year > year)) {
    //     console.log(today);
    //     res.status(400).send({ message: 'Wrong year input' });
    // } else {
    // if (!checkDateinput()) {
    //     console.log('Date input wrong');
    // } else {
    Award.findAll({
            where: {
                type: req.body.type,
                year: 2001
                    //year: req.body.year
            }
        })
        .then(awards => {
            if (awards.length != 0) {
                res.status(400).send({ message: 'Award already exists.' });
            } else {
                //Create award

                //awardData.year = year;
                //awardData.year = req.body.year;
                if (req.body.type == 0 || req.body.type == '' || req.body.type == null) {
                    Award_type.findAll({
                            where: {
                                name: req.body.name
                            }
                        })
                        .then(result => {
                            if (result.length != 0) {
                                res.status(400).send({ message: 'New award name is already exist' });
                            } else {
                                Award_type.create({ name: req.body.name });
                                Award_type.findOne({
                                        where: {
                                            name: req.body.name
                                        }
                                    })
                                    .then(award => {
                                        awardData.type = award.id;
                                    })
                            }
                        })
                        .catch(err => {
                            res.status(400).send({ message: 'Error when check new award name', err });
                        })

                }

                Award.create(awardData)
                    .then(award => {
                        //multichain.getInfo();
                        let stream_name = 'award_' + award.id;
                        let asset_name = 'asset_' + award.id;
                        let token_name = 'token_' + award.id;
                        console.log(stream_name);
                        //Create new stream
                        multichain.createStream(stream_name);
                        //Subscribe
                        multichain.subscribe(stream_name);
                        //Add infomation
                        multichain.initiateMultichain().publish({
                            stream: stream_name,
                            key: 'information',
                            data: {
                                "json": {
                                    "id": awardData.id,
                                    "name": awardData.name,
                                    "year": awardData.year,
                                    "date_start": awardData.date_start,
                                    "date_end": awardData.date_end,
                                    "created_at": awardData.created_at,
                                    "updated_at": awardData.updated_at
                                }
                            }
                        }, (err, info) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Input infomation of award to stream successfully');
                            }
                        });

                        voterData.id_award = award.id;
                        nomineeData.id_award = award.id;
                        nomineeVotes.id_award = award.id;

                        //Find voter with role
                        const voter = req.body.id_role_voter;
                        if (voter.length == 0) {
                            res.status(400).send({ message: 'There is no voter' });
                        } else {
                            for (var j = 0; j < voter.length; j++) {
                                User.findAll({
                                        where: {
                                            id_role: voter[j],
                                            is_active: 1
                                        }
                                    })
                                    .then(users => {
                                        if (users.length == 0) {
                                            res.status(400).send({ message: 'There is no user' });
                                        } else {
                                            multichain.initiateMultichain().getNewAddress()
                                                .then(address => {
                                                    console.log('Get a new address for asset');
                                                    //Grant permission for asset
                                                    multichain.grantC(address, 'receive,send')
                                                        .then(() => {
                                                            console.log('Grant permission successfully');
                                                            let asset_data = {
                                                                id: 0,
                                                                address: address
                                                            }
                                                            multichain.publishC(stream_name, asset_name, asset_data)
                                                                .then(() => {
                                                                    //Create new asset
                                                                    multichain.issueC(address, token_name, users.length * 9)
                                                                        .then(() => {
                                                                            for (var i = 0; i < users.length; i++) {
                                                                                voterData.id_user = users[i].id;
                                                                                let id = users[i].id;
                                                                                multichain.initiateMultichain().listStreamKeyItems({
                                                                                        stream: stream_name,
                                                                                        key: asset_name,
                                                                                        //verbose: true
                                                                                    })
                                                                                    .then(asset => {
                                                                                        let asset_txid = asset[0].txid;
                                                                                        console.log(asset_txid);
                                                                                        multichain.initiateMultichain().getStreamItem({
                                                                                                stream: stream_name,
                                                                                                txid: asset_txid
                                                                                            })
                                                                                            .then(result => {
                                                                                                //Get address of asset
                                                                                                address1 = result.data.json.address;
                                                                                                //Get new address
                                                                                                multichain.initiateMultichain().getNewAddress()
                                                                                                    .then(address2 => {
                                                                                                        console.log('Get new address for voter ');
                                                                                                        //Grant permission for voter
                                                                                                        multichain.grant(address2, 'receive,send');
                                                                                                        //Save data to stream
                                                                                                        let key_name1 = 'voter';
                                                                                                        User.findOne({
                                                                                                                where: {
                                                                                                                    id: id
                                                                                                                }
                                                                                                            })
                                                                                                            .then(user => {
                                                                                                                let voter_data = {
                                                                                                                    id: user.id,
                                                                                                                    first_name: user.first_name,
                                                                                                                    last_name: user.last_name,
                                                                                                                    english_name: user.english_name,
                                                                                                                    address: address2
                                                                                                                }
                                                                                                                multichain.publishEmployee(stream_name, key_name1, voter_data);
                                                                                                                //Send token to voter
                                                                                                                multichain.sendAssetFrom(address1, address2, token_name, 9);
                                                                                                                //Revoke permission
                                                                                                                multichain.revoke(address2, 'receive,send');
                                                                                                            })
                                                                                                            .catch(err => {
                                                                                                                console.log('Error when send token ' + err);
                                                                                                            })
                                                                                                    })
                                                                                                    .catch(err => {
                                                                                                        console.log('Error when get new address ' + err);
                                                                                                    })
                                                                                            })
                                                                                            .catch(err => {
                                                                                                console.log('Error when get stream item ' + err);
                                                                                            })
                                                                                    })
                                                                                    .catch(err => {
                                                                                        console.log('Error when list asset address ' + err);
                                                                                    })


                                                                                //Add voter
                                                                                Voter.create(voterData)
                                                                                    .then(() => {})
                                                                                    .catch(err => {
                                                                                        console.log('error0' + err)
                                                                                        res.status(400).send({ error0: err })
                                                                                    })
                                                                            }

                                                                        })
                                                                })

                                                        })

                                                })

                                            .catch(err => {
                                                console.log('Error when set new address ' + err);
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        res.status(400).send({ error1: err })
                                    })
                            }
                        }

                        // Find nominee with id
                        const nominee = req.body.id_nominee;
                        if (nominee.length == 0) {
                            res.status(400).send({ message: 'There is no nominee' });
                        } else {
                            for (var k = 0; k < nominee.length; k++) {
                                User.findAll({
                                        where: {
                                            id: nominee[k],
                                            is_active: 1
                                        }
                                    })
                                    .then(users => {
                                        if (users.length == 0) {
                                            //res.status(400).send({ message: 'User does not exist' })
                                        } else {
                                            for (var i = 0; i < users.length; i++) {
                                                nomineeData.id_team = users[i].id_team;
                                                nomineeData.id_nominee = users[i].id;
                                                nomineeVotes.id_nominee = users[i].id;
                                                nomineeVotes.rank = i + 1;
                                                let nominee_data = {
                                                    id: users[i].id,
                                                    first_name: users[i].first_name,
                                                    last_name: users[i].last_name,
                                                    english_name: users[i].english_name
                                                }
                                                multichain.setNominee(stream_name, nominee_data);
                                                multichain.setNomineeVote(stream_name, nominee_data);

                                                //Add nominee
                                                Nominee.create(nomineeData)
                                                    .then(() => {})
                                                    .catch(err => {
                                                        console.log('error0' + err)
                                                        res.status(400).send({ error5: err })
                                                    })

                                                //Add nominee default votes
                                                Breakdown.create(nomineeVotes)
                                                    .then(() => {})
                                                    .catch(err => {
                                                        console.log('error0' + err)
                                                        res.status(400).send({ error6: err })
                                                    })
                                            }
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        // res.status(400).send({ error4: err })
                                    })
                            }
                        }
                        res.status(200).send({ message: 'Create award successfully.' });
                    })
                    .catch(err => {
                        res.status(400).send({ error2: err })
                    })
            }
        })
        .catch(err => {
            res.status(400).send({ error3: err })
        })
        // }
        // }
})