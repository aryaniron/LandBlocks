export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/../org4/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export PEER0_ORG1_CA=${PWD}/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export PEER0_ORG2_CA=${PWD}/../org2/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export PEER0_ORG3_CA=${PWD}/../org3/crypto-config/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/../channel-artifacts/config/

export GOPATH=/usr/local/go
export PATH=$PATH:$GOPATH/bin

export CHANNEL_NAME=mychannel

setGlobalsForPeer0Org1() {
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

setGlobalsForPeer1Org1() {
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:8051

}

# setGlobalsForPeer0Org2() {
#     export CORE_PEER_LOCALMSPID="Org2MSP"
#     export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
#     export CORE_PEER_MSPCONFIGPATH=${PWD}/../../artifacts/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
#     export CORE_PEER_ADDRESS=localhost:9051

# }

# setGlobalsForPeer1Org2() {
#     export CORE_PEER_LOCALMSPID="Org2MSP"
#     export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
#     export CORE_PEER_MSPCONFIGPATH=${PWD}/../../artifacts/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
#     export CORE_PEER_ADDRESS=localhost:10051

# }


echo Enter name of Chaincode : 
read chaincode_name

echo Enter version number : 
read chaincode_version

CHANNEL_NAME="mychannel"
CC_RUNTIME_LANGUAGE="golang"
VERSION=$chaincode_version
CC_SRC_PATH="./../chaincodes/$chaincode_name/go"
CC_NAME=$chaincode_name


commitChaincodeDefination() {
    setGlobalsForPeer0Org1
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        --channelID $CHANNEL_NAME --name ${CC_NAME} \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
        --peerAddresses localhost:11051 --tlsRootCertFiles $PEER0_ORG3_CA \
        --version ${VERSION} --sequence ${VERSION} --init-required
}

# commitChaincodeDefination

queryCommitted() {
    setGlobalsForPeer0Org1
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME}

}

# queryCommitted

chaincodeInvokeInit() {
    setGlobalsForPeer0Org1
    peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        -C $CHANNEL_NAME -n ${CC_NAME} \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
         --peerAddresses localhost:11051 --tlsRootCertFiles $PEER0_ORG3_CA \
        --isInit -c '{"Args":[]}'

}

 # --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \

# chaincodeInvokeInit

chaincodeInvoke() {
    setGlobalsForPeer0Org1

    ## Create Car
    peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        -C $CHANNEL_NAME -n ${CC_NAME} \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA   \
        --peerAddresses localhost:11051 --tlsRootCertFiles $PEER0_ORG3_CA \
        -c '{"function": "AddProperty","Args":["land-35", "Aryan", "234", "fhuioyh7u34yt78yhfht", "Commercial", "No", "sfgvohng,ggduoighd,erg", "180001", "Chakroi", "RS Pura", "Jammu", "Jammu", "J&K","1/2/4", "12.354,67.982323,29.00121,34.56767,30.9001,23.45674" ]}'
        
        #'{"function": "MakeSaleDeed","Args":["SD-2", "land-32", "400", "Rahul", "archana","30/12/1995"]}'
        #'{"function": "AddUser","Args":["user-39", "Aryan", "Indian", "53532452545", "9149965887", "Ngfgf@gmail.com", "sfgvohng,ggduoighd,erg", "fsdfgsfdg,6556fgfd","180001", "Chakroi", "RS Pura", "Jammu", "Jammu", "J&K"]}'
        #'{"function": "GrantBuyRequest","Args":["request22"]}'
        #'{"function": "MakeBuyRequest","Args":["request22"]}'
        #'{"function": "GrantInfoRequest","Args":["request22"]}'
        #'{"function": "AddInfoRequest","Args":["request22","land-32","SDFDGE","duhara"]}'
        #'{"function": "TransferProperty","Args":["land-32","Sneha","SDFDGETR432423"]}'
        #'{"function": "AddProperty","Args":["land-32", "Aryan", "234", "fhuioyh7u34yt78yhfht", "Commercial", "No", "sfgvohng,ggduoighd,erg", "180001", "Chakroi", "RS Pura", "Jammu", "Jammu", "J&K","1/2/4", "12.354,67.982323,29.00121,34.56767,30.9001,23.45674" ]}'
 
#'{"function": "ForSale","Args":["land-32","true"]}'
    ## Init ledger
    # peer chaincode invoke -o localhost:7050 \
    #     --ordererTLSHostnameOverride orderer.example.com \
    #     --tls $CORE_PEER_TLS_ENABLED \
    #     --cafile $ORDERER_CA \
    #     -C $CHANNEL_NAME -n ${CC_NAME} \
    #     --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    #     --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    #     -c '{"function": "initLedger","Args":[]}'

}

# chaincodeInvoke

chaincodeQuery() {
    setGlobalsForPeer0Org1

    # Query Car by Id
    peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "QueryPropertyById","Args":["land-32"]}'
    #'{"function": "QuerySaleDeedById","Args":["SD-2"]}'
    #'{"function": "QueryUsersBy","Args":["pincode","180001"]}'
    #'{"function": "AddUser","Args":["landId","land-32"]}'
    #'{"function": "QueryRequestById","Args":["request22"]}'
    #'{"function": "GetPropertyHistory","Args":["land-32"]}'
    #'{"function": "QueryPropertiesBy","Args":["ownerId","Sneha"]}'
    #'{"function": "QueryPropertyById","Args":["land-32"]}'
    
}

# chaincodeQuery

# Run this function if you add any new dependency in chaincode

commitChaincodeDefination
queryCommitted
chaincodeInvokeInit
# sleep 5
#chaincodeInvoke
# sleep 3
#chaincodeQuery
