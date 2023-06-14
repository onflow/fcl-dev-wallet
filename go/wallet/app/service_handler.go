package app

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


func (app *App) postServiceHandler(w http.ResponseWriter, r *http.Request) {
	service := strings.TrimPrefix(r.URL.Path, "/api/")
	if service == "" {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	fclMessageJson, err := ioutil.ReadAll(r.Body)
	if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
	}

	pollingId := app.nextPollingId
	app.nextPollingId++

	// Resolve baseUrl
	protocol := r.Header.Get("X-Forwarded-Proto")
	if(protocol == "") {
		protocol = r.Proto
	}

	host := r.Header.Get("X-Forwarded-Host")
	if(host == "") {
		host = r.Host
	}

	baseUrl := protocol + "://" + host

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

	pendingResponseJson, err := json.Marshal(pendingResponse)
	
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	app.pollingSessions[pollingId] = string(pendingResponseJson)

	responseJson, err := json.Marshal(ServicePostResponse{
		FclResponse: pendingResponse,
		Local: Service{
			FType: "Service",
			FVsn: "1.0.0",
			Type: "local-view",
			Endpoint: baseUrl + "/fcl/" + service,
			Method: "VIEW/IFRAME",
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