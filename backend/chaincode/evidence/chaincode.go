package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type CustodyEvent struct {
	EventID       string `json:"event_id"`
	EvidenceID    string `json:"evidence_id"`
	EventType     string `json:"event_type"`
	Actor         string `json:"actor"`
	Organization  string `json:"organization"`
	Timestamp     string `json:"timestamp"`
	Hash          string `json:"hash"`
	Signature     string `json:"signature"`
	ParentID      string `json:"parent_id"`
}

func (s *SmartContract) RecordEvent(ctx contractapi.TransactionContextInterface, eventJSON string) error {
	var event CustodyEvent
	err := json.Unmarshal([]byte(eventJSON), &event)
	if err != nil {
		return err
	}
	
	eventAsBytes, err := json.Marshal(event)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(event.EventID, eventAsBytes)
}

func (s *SmartContract) GetEvent(ctx contractapi.TransactionContextInterface, eventID string) (*CustodyEvent, error) {
	eventAsBytes, err := ctx.GetStub().GetState(eventID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if eventAsBytes == nil {
		return nil, fmt.Errorf("the event %s does not exist", eventID)
	}

	var event CustodyEvent
	err = json.Unmarshal(eventAsBytes, &event)
	if err != nil {
		return nil, err
	}

	return &event, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		fmt.Printf("Error creating chaincode: %v", err)
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting chaincode: %v", err)
	}
}
