package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// PropertyTransfer contract to show the property transfer transactions
type SaleDeedSmartContract struct {
	contractapi.Contract
}

// Property describes basic details
type SaleDeed struct {
	ID           string `json:"id"`
	KhasraNumber string `json:"khasraNumber"`
	Tehsil string `json:"tehsil"`
	District string `json:"district"`
	StateOrUT string `json:"stateOrUt"`
	Amount       string `json:"amount"`
	SellerID     string `json:"sellerId"`
	SellerAadhaarFront string `json:"sellerAadhaarFront"`
	SellerAadhaarBack string `json:"sellerAadhaarBack"`
	SellerImage  string `json:"sellerImage"`
	SellerSignature string `json:"sellerSignature"`
	BuyerID      string `json:"buyerId"`
	BuyerAadhaarFront string `json:"buyerAadhaarFront"`
	BuyerAadhaarBack string `json:"buyerAadhaarBack"`
	BuyerImage   string `json:"buyerImage"`
	BuyerSignature string `json:"buyerSignature"`
	//##########################
	DrafterID string `json:"drafterId"`
	DrafterSignature string `json:"drafterSignature"`
	Status    string `json:"status"`
	Time      string `json:"time"`
}

// This function helps to Add new property
func (sc *SaleDeedSmartContract) MakeSaleDeedRequestBuyer(ctx contractapi.TransactionContextInterface, id string, khasraNumber string, tehsil string, district string, stateOrUt string, amount string, sellerId string, buyerId string, buyerAadhaarFront string, buyerAadhaarBack string, buyerImage string, buyerSignature string) error {
	saleDeedJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("Failed to read the data from world state", err)
	}

	if saleDeedJSON != nil {
		return fmt.Errorf("the saledeed Request already exists")
	}

	saleDeed := SaleDeed{
		ID:           id,
		KhasraNumber: khasraNumber,
		Tehsil: tehsil,
		District: district,
		StateOrUT: stateOrUt,
		Amount:       amount,
		SellerID:     sellerId,
		SellerAadhaarFront : "",
		SellerAadhaarBack : "",
		SellerImage:  "",
		SellerSignature:"",
		BuyerID:      buyerId,
		BuyerAadhaarFront : buyerAadhaarFront,
		BuyerAadhaarBack : buyerAadhaarBack,
		BuyerImage:   buyerImage,
		BuyerSignature: buyerSignature,
		DrafterID:    "",
		DrafterSignature:"",
		Status:       "SellerAwaited",
		Time:         "",
	}

	saleDeedBytes, err := json.Marshal(saleDeed)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, saleDeedBytes)
}

func (sc *SaleDeedSmartContract) QuerySaleDeedById(ctx contractapi.TransactionContextInterface, id string) (*SaleDeed, error) {
	saleDeedJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("Failed to read the data from world state", err)
	}

	if saleDeedJSON == nil {
		return nil, fmt.Errorf("the saledeed does not exist")
	}

	var saleDeed *SaleDeed
	err = json.Unmarshal(saleDeedJSON, &saleDeed)

	if err != nil {
		return nil, err
	}
	return saleDeed, nil
}

// This functions helps to transfer the ownserhip of the property
func (rc *SaleDeedSmartContract) MakeSaleDeedRequestSeller(ctx contractapi.TransactionContextInterface, id string, sellerAadhaarFront string, sellerAadhaarBack string, sellerImage string, sellerSignature string) error {
	saleDeed, err := rc.QuerySaleDeedById(ctx, id)

	saleDeed.SellerAadhaarFront = sellerAadhaarFront
	saleDeed.SellerAadhaarBack = sellerAadhaarBack
	saleDeed.SellerImage = sellerImage
	saleDeed.SellerSignature=sellerSignature
	saleDeed.Status="DrafterAwaited"
	saleDeedJSON, err := json.Marshal(saleDeed)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(id, saleDeedJSON)
}

func (rc *SaleDeedSmartContract) RejectSaleDeed(ctx contractapi.TransactionContextInterface, id string) error {
	saleDeed, err := rc.QuerySaleDeedById(ctx, id)

	saleDeed.Status="Rejected"
	saleDeedJSON, err := json.Marshal(saleDeed)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(id, saleDeedJSON)
}

// This functions helps to transfer the ownserhip of the property
func (rc *SaleDeedSmartContract) MakeSaleDeedInspector(ctx contractapi.TransactionContextInterface, id string, drafterId string, drafterSignature string, time string) error {
	saleDeed, err := rc.QuerySaleDeedById(ctx, id)

	saleDeed.DrafterID = drafterId
	saleDeed.Status = "Approved"
	saleDeed.DrafterSignature = drafterSignature
	saleDeed.Time = time

	saleDeedJSON, err := json.Marshal(saleDeed)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(id, saleDeedJSON)
}


func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*SaleDeed, error) {
	var saleDeeds []*SaleDeed
	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var saleDeed SaleDeed
		err = json.Unmarshal(queryResult.Value, &saleDeed)
		if err != nil {
			return nil, err
		}
		saleDeeds = append(saleDeeds, &saleDeed)
	}

	return saleDeeds, nil
}

func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*SaleDeed, error) {
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

func (pc *SaleDeedSmartContract) QueryPendingSaleDeedsSeller(ctx contractapi.TransactionContextInterface, seller string, khasraNumber string) ([]*SaleDeed, error) {
	queryString := fmt.Sprintf(`{"selector":{"sellerId":"%s", "khasraNumber":"%s","status":"SellerAwaited" }}`, seller, khasraNumber)
	return getQueryResultForQueryString(ctx, queryString)
}

func (pc *SaleDeedSmartContract) QueryCompletedSaleDeedsSeller(ctx contractapi.TransactionContextInterface, seller string, khasraNumber string) ([]*SaleDeed, error) {
	queryString := fmt.Sprintf(`{"selector":{"sellerId":"%s", "khasraNumber":"%s","status":"DrafterAwaited"}}`, seller, khasraNumber)
	return getQueryResultForQueryString(ctx, queryString)
}

func (pc *SaleDeedSmartContract) QuerySaleDeedsByKhasra(ctx contractapi.TransactionContextInterface, khasraNumber string) ([]*SaleDeed, error) {
	queryString := fmt.Sprintf(`{"selector":{"khasraNumber":"%s"}}`, khasraNumber)
	return getQueryResultForQueryString(ctx, queryString)
}

func (pc *SaleDeedSmartContract) QuerySaleDeedsByTehsil(ctx contractapi.TransactionContextInterface, tehsil string, district string, stateOrUt string) ([]*SaleDeed, error) {
	queryString := fmt.Sprintf(`{"selector":{"tehsil":"%s", "district":"%s","stateOrUt":"%s" }}`, tehsil, district, stateOrUt)
	return getQueryResultForQueryString(ctx, queryString)
}

func main() {
	saledeedSmartContract := new(SaleDeedSmartContract)

	cc, err := contractapi.NewChaincode(saledeedSmartContract)

	if err != nil {
		panic(err.Error())
	}

	if err := cc.Start(); err != nil {
		panic(err.Error())
	}
}
