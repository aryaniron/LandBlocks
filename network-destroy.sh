#!/bin/bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

cd ~/LandBlocksHyperLedger/channel-artifacts
sudo rm genesis.block
sudo rm mychannel.tx
sudo rm Org1MSPanchors.tx
sudo rm Org2MSPanchors.tx
sudo rm Org3MSPanchors.tx


cd ~/LandBlocksHyperLedger/org1/channel-artifacts
sudo rm mychannel.block

cd ~/LandBlocksHyperLedger/org1
sudo rm -r crypto-config

cd ~/LandBlocksHyperLedger/org1/create-certificate-with-ca
sudo rm -r fabric-ca


cd ~/LandBlocksHyperLedger/org2/channel-artifacts
sudo rm mychannel.block

cd ~/LandBlocksHyperLedger/org2
sudo rm -r crypto-config

cd ~/LandBlocksHyperLedger/org2/create-certificate-with-ca
sudo rm -r fabric-ca

cd ~/LandBlocksHyperLedger/org3/channel-artifacts
sudo rm mychannel.block

cd ~/LandBlocksHyperLedger/org3
sudo rm -r crypto-config

cd ~/LandBlocksHyperLedger/org3/create-certificate-with-ca
sudo rm -r fabric-ca

cd ~/LandBlocksHyperLedger/org4
sudo rm -r crypto-config

cd ~/LandBlocksHyperLedger/org4/create-certificate-with-ca
sudo rm -r fabric-ca

cd ~/LandBlocksHyperLedger/chaincodes/land/go
sudo rm -r vendor
sudo rm go
sudo rm go.mod
sudo rm go.sum

cd ~/LandBlocksHyperLedger/chaincodes/saledeed/go
sudo rm -r vendor
sudo rm go
sudo rm go.mod
sudo rm go.sum

cd ~/LandBlocksHyperLedger/api-server/src
sudo rm -r wallets

cd ~/LandBlocksHyperLedger/api-server
sudo rm -r data