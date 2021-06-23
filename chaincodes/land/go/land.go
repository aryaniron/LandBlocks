package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/golang/protobuf/ptypes"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// LandTransfer contract to show the land transfer transactions
type LandSmartContract struct {
	contractapi.Contract
}

// type Coordinate struct {
// 	latitude  float64 `json:"latitude"`
// 	longitude float64 `json:"longitude"`
// }

// Land describes basic details
type Land struct {
	KhasraNumber string `json:"khasraNumber"`
	OwnerID      string `json:"ownerId"`
	Area         int    `json:"area"`
	TitleDeedID  string `json:"titleDeedId"`
	DateOfRegisteration string `json:"dateOfRegisteration"`
	TypeOf       string `json:"typeOf"`
	Encumberance string `json:"encumbrance"`
	Points       string `json:"points"`

	Street        string `json:"street"`
	Pincode       int    `json:"pincode"`
	VillageOrCity string `json:"villageOrCity"`
	Tehsil        string `json:"tehsil"`
	District      string `json:"district"`
	Division      string `json:"division"`
	StateOrUT     string `json:"stateOrUt"`

	IntentForSale string `json:"intentForSale"`
	Price         string `json:"price"`
}

// HistoryQueryResult structure used for returning result of history query
type HistoryQueryResult struct {
	Record    *Land `json:"record"`
	TxId      string    `json:"txId"`
	Timestamp time.Time `json:"timestamp"`
	IsDelete  bool      `json:"isDelete"`
}

// This function helps to Add new Land
func (pc *LandSmartContract) AddLand(ctx contractapi.TransactionContextInterface, khasraNumber string, ownerId string, area int, titleDeedId string, dateOfRegisteration string, typeOf string, encumbrance string, street string, pincode int, villageOrCity string, tehsil string, district string, division string, stateOrUt string, points string) error {
	landJSON, err := ctx.GetStub().GetState(khasraNumber)
	if err != nil {
		return fmt.Errorf("Failed to read the data from world state", err)
	}

	if landJSON != nil {
		return fmt.Errorf("the land already exists")
	}

	// coordJson := points
	// var coordinates []Coordinate
	// json.Unmarshal([]byte(coordJson), &coordinates)

	prop := Land{
		KhasraNumber:      khasraNumber,
		OwnerID:           ownerId,
		Area:              area,
		TitleDeedID:       titleDeedId,
		DateOfRegisteration: dateOfRegisteration,
		TypeOf:            typeOf,
		Encumberance:      encumbrance,
		Points:            points,
		Street:            street,
		Pincode:           pincode,
		VillageOrCity:     villageOrCity,
		Tehsil:            tehsil,
		District:          district,
		Division:          division,
		StateOrUT:         stateOrUt,
		IntentForSale:     "false",
		Price:             "null",
	}

	landBytes, err := json.Marshal(prop)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(khasraNumber, landBytes)
}

// constructQueryResponseFromIterator constructs a slice of assets from the resultsIterator
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*Land, error) {
	var lands []*Land
	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var land Land
		err = json.Unmarshal(queryResult.Value, &land)
		if err != nil {
			return nil, err
		}
		lands = append(lands, &land)
	}

	return lands, nil
}

func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*Land, error) {
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

func (pc *LandSmartContract) QueryLandsByOwner(ctx contractapi.TransactionContextInterface, ownerId string) ([]*Land, error) {
	queryString := fmt.Sprintf(`{"selector":{"ownerId":"%s"}}`, ownerId)
	return getQueryResultForQueryString(ctx, queryString)
}

func (pc *LandSmartContract) QueryLandsByTehsil(ctx contractapi.TransactionContextInterface, tehsil string, district string, stateOrUt string) ([]*Land, error) {
	queryString := fmt.Sprintf(`{"selector":{"tehsil":"%s", "district":"%s","stateOrUt":"%s" }}`, tehsil, district, stateOrUt)
	return getQueryResultForQueryString(ctx, queryString)
}

func (pc *LandSmartContract) QueryLandsForSale(ctx contractapi.TransactionContextInterface, intentForSale string) ([]*Land, error) {
	queryString := fmt.Sprintf(`{"selector":{"intentForSale":"%s"}}`, intentForSale)
	return getQueryResultForQueryString(ctx, queryString)
}

// This function returns all the existing lands
func (pc *LandSmartContract) QueryAllLands(ctx contractapi.TransactionContextInterface) ([]*Land, error) {
	landIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer landIterator.Close()

	var lands []*Land
	for landIterator.HasNext() {
		landResponse, err := landIterator.Next()
		if err != nil {
			return nil, err
		}

		var land *Land
		err = json.Unmarshal(landResponse.Value, &land)
		if err != nil {
			return nil, err
		}
		lands = append(lands, land)
	}

	return lands, nil
}

// // This function helps to query the land by Id
func (pc *LandSmartContract) QueryLandById(ctx contractapi.TransactionContextInterface, khasraNumber string) (*Land, error) {
	landJSON, err := ctx.GetStub().GetState(khasraNumber)
	if err != nil {
		return nil, fmt.Errorf("Failed to read the data from world state", err)
	}

	if landJSON == nil {
		return nil, fmt.Errorf("the land does not exist")
	}

	var land *Land
	err = json.Unmarshal(landJSON, &land)

	if err != nil {
		return nil, err
	}
	return land, nil
}

// This functions helps to transfer the ownserhip of the land
func (pc *LandSmartContract) TransferLand(ctx contractapi.TransactionContextInterface, khasraNumber string, newOwnerId string, newTitleDeedId string, dateOfRegisteration string) error {
	land, err := pc.QueryLandById(ctx, khasraNumber)
	if err != nil {
		return err
	}

	land.OwnerID = newOwnerId
	land.TitleDeedID = newTitleDeedId
	land.DateOfRegisteration = dateOfRegisteration
	landJSON, err := json.Marshal(land)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(khasraNumber, landJSON)

}

func (pc *LandSmartContract) ForSale(ctx contractapi.TransactionContextInterface, khasraNumber string, val string, price string) (*Land, error) {
	land, err := pc.QueryLandById(ctx, khasraNumber)
	if err != nil {
		return nil, fmt.Errorf("Failed to read the data from world state", err)
	}

	land.IntentForSale = val
	land.Price = price
	landJSON, err := json.Marshal(land)
	if err != nil {
		return nil, fmt.Errorf("Failed status", err)
	}

	ctx.GetStub().PutState(khasraNumber, landJSON)
	return land, nil
}

func (pc *LandSmartContract) GetLandHistory(ctx contractapi.TransactionContextInterface, khasraNumber string) ([]HistoryQueryResult, error) {
	log.Printf("GetAssetHistory: KHASRA ID %s", khasraNumber)

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(khasraNumber)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var records []HistoryQueryResult
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var land Land
		if len(response.Value) > 0 {
			err = json.Unmarshal(response.Value, &land)
			if err != nil {
				return nil, err
			}
		} else {
			land = Land{
				KhasraNumber: khasraNumber,
			}
		}

		timestamp, err := ptypes.Timestamp(response.Timestamp)
		if err != nil {
			return nil, err
		}

		record := HistoryQueryResult{
			TxId:      response.TxId,
			Timestamp: timestamp,
			Record:    &land,
			IsDelete:  response.IsDelete,
		}
		records = append(records, record)
	}

	return records, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&LandSmartContract{})
	if err != nil {
		log.Panicf("Error creating asset chaincode: %v", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panicf("Error starting asset chaincode: %v", err)
	}
}
