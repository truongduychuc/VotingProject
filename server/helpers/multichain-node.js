const multichainNode = require('../lib/multichain-node');
const winston = require('../config/winston');
const logger = require('../helpers/logging')(__filename, winston);


const loadMultiChainConfig = () => ({
  port: process.env.MULTICHAIN_PORT || 9228,
  host: process.env.MULTICHAIN_HOST || '127.0.0.1',
  user: process.env.MULTICHAIN_USER || 'multichainrpc',
  pass: process.env.MULTICHAIN_PASSWORD || '9sfodHXB9RJ41uSxhNGa1CXnHu7GF399PsuxWx5Zhnfo'
});

/**Use to call multichain methods*/
class ClientCaller {
  constructor() {
    this.multichain = multichainNode(loadMultiChainConfig());
  }

  /**
   *
   * @return Promise
   * */
  getInfo() {
    return this.multichain.getInfo();
  }

  /**
   * @param streamName
   * @return Promise
   * */
  createStream(streamName) {
    streamName = streamName.toString();
    return this.multichain.create({
      type: 'stream',
      name: streamName,
      open: false
    })
  }

  /**
   * @param streamName
   * @return Promise
   * */
  subscribe(streamName) {
    return this.multichain.subscribe({
      stream: streamName
    });
  }

  /**
   * @param streamName
   * @param keyName
   * @param data
   * @return Promise
   * */
  publish(streamName, keyName, data) {
    const {id, address} = data;
    const chainData = {
      "json": JSON.stringify({id, address})
    };
    return this.multichain.publish({
      stream: streamName,
      key: keyName,
      data: chainData
    })
  }

  publishEmployee(streamName, keyName, data) {
    const {id, first_name, last_name, english_name, address} = data;
    const chainData = {
      "json": JSON.stringify({
        id,
        first_name,
        last_name,
        english_name,
        address
      })
    };
    return this.multichain.publish({
      stream: streamName,
      key: keyName,
      data: chainData
    })
  }

  publishInformation(streamName, data) {
    return this.multichain.publish({
      stream: streamName,
      key: 'information',
      data: {
        "json": JSON.stringify(data)
      }
    })
  }

  /**
   * @param {string} streamName;
   * @param {string} assetName;
   * @param {string} tokenName;
   * @param {number} totalVoter;
   * @return Promise<string>
   * */
  async setAsset(streamName, assetName, tokenName, totalVoter) {
    try {
      const newAddress = await this.multichain.getNewAddress();
      logger.info('setAsset: Get a new address ' + newAddress + ' for asset');
      await this.grant(newAddress, 'receive,send');
      logger.info('setAsset: Granted receive and send for address' + newAddress);
      const assetData = {
        id: 0,
        address: newAddress
      };
      await this.publish(streamName, assetName, assetData);
      logger.info('setAsset: Published stream ' + streamName);
      const issued = await this.issue(newAddress, tokenName, totalVoter * 9);
      logger.info('setAsset: issued' + issued);
      return newAddress;
    } catch (e) {
      throw e;
    }
  }

  async sendTokenToVoter(streamName, senderAddress, tokenName, voterData) {
    try {
      const receiverAddress = await this.multichain.getNewAddress();
      logger.info('sendTokenToVoter: Got receiver address' + receiverAddress);
      // grant to receiver
      await this.grant(receiverAddress, 'receive,send');
      // save data to stream
      const keyName1 = 'voter';
      voterData = {
        ...voterData,
        address: receiverAddress
      };
      await this.publishEmployee(streamName, keyName1, voterData);
      // send token to voter
      const sentResult = await this.sendAssetFrom(senderAddress, receiverAddress, tokenName, 9);
      await this.revoke(receiverAddress, 'send');
      return sentResult;
    } catch (err) {
      logger.error('Error when send token to voter');
      throw err;
    }
  }

  async setNominee(streamName, data) {
    try {
      logger.info('setNominee: Start setting nominee ' + data.id);
      const {id, first_name, last_name, english_name} = data;
      const nomineeAddress = await this.multichain.getNewAddress();
      logger.info('setNominee: get new address for new nominee ' + data.id);
      await this.grant(nomineeAddress, 'receive');
      logger.info('setNominee: granted receive permission for nominee' + data.id);
      const keyName = 'nominee';
      const nomineeData = {
        id,
        first_name,
        last_name,
        english_name
      };
      logger.info('setNominee: Publishing nominee' + data.id);
      return await this.publishEmployee(streamName, keyName, nomineeData);
    } catch (e) {
      throw e;
    }
  }


  /**
   * @param {string} streamName
   * @param {Object} data
   *@return Promise
   */
  async setNomineeVote(streamName, data) {
    try {
      const {id} = data;
      if (id == null || id === '') {
        throw ('Id must not be undefined');
      }
      return await this.multichain.publish({
        stream: streamName,
        key: `nominee_${id}`,
        data: {
          "json": JSON.stringify({
            first_votes: 0,
            second_votes: 0,
            third_votes: 0
          })
        }
      });
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {Object} data
   * @return Promise
   * */
  async getVoterInfo(data) {
    try {
      const {id} = data;
      if (id == null || id === '') {
        throw ('Id must not be undefined')
      }
      const streamName = `award_${id}`;
      const voters = await this.multichain.listStreamKeyItems({
        stream: streamName,
        key: 'voter'
      });
      logger.info('Get list voter successfully!');
      for (let voter of voters) {
        const {txid} = voter;
        // check id voter;
        const voterStream = await this.multichain.getStreamItem({
          stream: streamName,
          txid
        });
        const {id: voterID} = voterStream.data.json;
        if (data.id_voter == voterID) {
          const address = voterStream.data.json.address;
          const balance = await this.multichain.getAddressBalances({
            address
          });
          if (!balance) {
            return null;
          } else {
            return balance;
          }
        }
      }
      throw ('getVoterInfo: Voter not found');
    } catch (e) {
      logger.error('getVoterInfo: Error when get voter info' + e);
      throw e;
    }
  }

  /**
   * @param {Object} data
   * @return {void}
   * */
  async addNomineeData(data) {
    try {
      const {
        id,
      } = data;
      const tokenName = `token_${id}`;
      const streamName = `award_${id}`;
      const voterList = await this.multichain.listStreamKeyItems({
        stream: streamName,
        key: 'voter'
      });
      logger.info('addNomineeData: Get list voter successfully');
      logger.info('addNomineeData: ' + voterList);
      for (let voter of voterList) {
        const {txid} = voter;
        const voterStream = await this.multichain.getStreamItem({
          stream: streamName,
          txid
        });
        const {id: voterID} = voterStream.data.json;
        if (data.id_voter == voterID) {
          const senderAddress = voterStream.data.json.address;
          await this.grant(senderAddress, 'receive,send');
          logger.info('addNomineeData: get info voter successfully');
          const nomineeList = await this.multichain.listStreamKeyItems({
            stream: streamName,
            key: 'nominee'
          });
          // bc here we only vote for 3 positions at the max limitation by hard coding
          // so we just need to limit 3 loop counter to reduce loops
          let count = 0;
          for (let nominee of nomineeList) {
            if (count > 3) {
              break;
            }
            const nomineeTxid = nominee.txid;
            const nomineeStream = await this.multichain.getStreamItem({
              stream: streamName,
              txid: nomineeTxid
            });
            logger.info('addNomineeVote: get nominee info successfully');
            const {id: nomineeID} = nomineeStream.data.json;
            const receiverAddress = nomineeStream.data.json.address;

            /**@param {number} position*/
            const getAmount = position => {
              switch (position) {
                case 1:
                  return 5;
                case 2:
                  return 3;
                case 3:
                  return 1;
                default:
                  return 0;
              }
            };
            const positionMap = ['first', 'second', 'third'].map((position, idx) => ({
              prefix: position,
              idx: idx + 1,
              amount: getAmount(idx + 1),
              idKey: 'id_nominee_' + position
            }));
            const voteMappingData = positionMap.find(p => data[p.idKey] === nomineeID);
            if (voteMappingData) {
              const voteKeyName = `nominee_${data[voteMappingData.idKey]}`;
              await this.sendAssetFrom(senderAddress, receiverAddress, tokenName, voteMappingData.amount);
              const votes = await this.multichain.getStreamKeySummary({
                stream: streamName,
                key: voteMappingData.idKey,
                mode: "jsonobjectmerge"
              });
              const voteChange = votes.json[voteMappingData.prefix + '_votes'] + 1;
              await this.multichain.publish({
                stream: streamName,
                key: voteKeyName,
                data: {
                  "json": JSON.stringify({
                    [voteMappingData.prefix + '_votes']: voteChange
                  })
                }
              });
              count++;
              logger.info('Updated vote for ' + voteMappingData.prefix + '_votes');
            }
          }
        }
      }
    } catch (e) {
      logger.error('addNomineeData: Error when adding nominee data' + e);
      throw e;
    }
  }

  /**
   * @param {string} address
   * @param {string} tokenName
   * @param {number} quantity
   * @return Promise
   * */
  issue(address, tokenName, quantity) {
    return this.multichain.issue({
      address,
      asset: tokenName,
      qty: quantity,
      units: 0.1
    })
  }

  /**
   * @param {string} addresses
   * @param {string} permissions
   * @return Promise
   * */
  grant(addresses, permissions) {
    return this.multichain.grant({
      addresses,
      permissions
    })
  }

  /**@param {string} addresses
   * @param {string} permissions
   * @return Promise
   * */
  revoke(addresses, permissions) {
    return this.multichain.revoke({
      addresses,
      permissions
    });
  }

  /**
   * @param {string} senderAddress
   * @param {string} receiverAddress
   * @param {string} tokenName
   * @param {number} amount
   * @return Promise
   * */
  sendAssetFrom(senderAddress, receiverAddress, tokenName, amount) {
    return this.multichain.sendAssetFrom({
      from: senderAddress,
      to: receiverAddress,
      asset: tokenName,
      qty: amount
    });
  }

  getNewAddress() {
    return this.multichain.getNewAddress();
  }
}

module.exports = new ClientCaller();
