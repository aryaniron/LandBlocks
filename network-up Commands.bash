#!/bin/bash
cd ~/LandBlocksHyperLedger/org1/create-certificate-with-ca
docker-compose up -d
./create-certificate-with-ca.sh

cd ~/LandBlocksHyperLedger/org2/create-certificate-with-ca
docker-compose up -d
./create-certificate-with-ca.sh

cd ~/LandBlocksHyperLedger/org3/create-certificate-with-ca
docker-compose up -d
./create-certificate-with-ca.sh

cd ~/LandBlocksHyperLedger/org4/create-certificate-with-ca
docker-compose up -d
./create-certificate-with-ca.sh

cd ~/LandBlocksHyperLedger/channel-artifacts
./create-artifacts.sh

cd ~/LandBlocksHyperLedger/org1
docker-compose up -d

cd ~/LandBlocksHyperLedger/org2
docker-compose up -d

cd ~/LandBlocksHyperLedger/org3
docker-compose up -d

cd ~/LandBlocksHyperLedger/org4
docker-compose up -d

cd ~/LandBlocksHyperLedger/org1
./createChannel.sh

cd ~/LandBlocksHyperLedger/org2
./joinChannel.sh

cd ~/LandBlocksHyperLedger/org3
./joinChannel.sh

cd ~/LandBlocksHyperLedger/chaincodes/land/go
go mod init land/go
go build

cd ~/LandBlocksHyperLedger/chaincodes/saledeed/go
go mod init saledeed/go
go build

cd ~/LandBlocksHyperLedger/org1
./deployChaincode.sh

cd ~/LandBlocksHyperLedger/org2
./installAndApproveChaincode.sh

cd ~/LandBlocksHyperLedger/org3
./installAndApproveChaincode.sh

cd ~/LandBlocksHyperLedger/org1
./commitChaincode.sh
./invokeAndQueryChaincode.sh

cd ~/LandBlocksHyperLedger/api-server/src/config
./generate-ccp-org1.sh
./generate-ccp-org2.sh

cd ~/LandBlocksHyperLedger/api-server
npm run docker:dev



docker prune --force