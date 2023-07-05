package wallet

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

type Service struct {
	FType string `json:"f_type"`
	FVsn string `json:"f_vsn"`
	Type string `json:"type"`
	Endpoint string `json:"endpoint"`
	Method string `json:"method"`
	Params map[string]string `json:"params"`
}

type FclResponse struct {
	FType string `json:"f_type"`
	FVsn string `json:"f_vsn"`
	Status string `json:"status"`
	Updates Service `json:"updates"`
}

type ServicePostResponse struct {
	FclResponse
	Local Service `json:"local"`
}

type FCLClient struct {
	Platform string `json:"platform"`
}

type FCLConfig struct {
	Client FCLClient `json:"client"`
}

type FCLMessage struct {
	Config FCLConfig `json:"config"`
}

func getMethod(fclMessageJson []byte) string {

	var fclMessage FCLMessage
	err := json.Unmarshal(fclMessageJson, &fclMessage)

	if err != nil {
		fmt.Println("Error:", err)
		return "VIEW/IFRAME"
	}

	if fclMessage.Config.Client.Platform == "react-native" {
		return "VIEW/MOBILE_BROWSER"
	}

	return "VIEW/IFRAME"
}

func (server *server) postServiceHandler(w http.ResponseWriter, r *http.Request) {
	service := strings.TrimPrefix(r.URL.Path, "/api/")
	if service == "" {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	fclMessageJson, err := ioutil.ReadAll(r.Body)
	method := getMethod(fclMessageJson)

	if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
	}

	pollingId := server.nextPollingId
	server.nextPollingId++

	// Resolve baseUrl
	baseUrl := getBaseUrl(r)

	pendingResponse := FclResponse{
		FType: "PollingResponse",
		FVsn: "1.0.0",
		Status: "PENDING",
		Updates: Service {
			FType: "PollingResponse",
			FVsn: "1.0.0",
			Type: "back-channel-rpc",
			Endpoint: baseUrl + "/api/polling-session",
			Method: "HTTP/GET",
			Params: map[string]string{
				"pollingId": fmt.Sprint(pollingId),
			},
		},
	}


	// Use json to convert struct to map
	tmp, err := json.Marshal(pendingResponse)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	pendingResponseMap := make(map[string]interface{})
	err = json.Unmarshal(tmp, &pendingResponseMap)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	server.pollingSessions[pollingId] = pendingResponseMap

	responseJson, err := json.Marshal(ServicePostResponse{
		FclResponse: pendingResponse,
		Local: Service{
			FType: "Service",
			FVsn: "1.0.0",
			Type: "local-view",
			Endpoint: baseUrl + "/fcl/" + service,
			Method: method,
			Params: map[string]string{
				"pollingId": fmt.Sprint(pollingId),
				"channel": "back",
				"fclMessageJson": string(fclMessageJson),
			},
		},
	})

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(responseJson))
}