package wallet

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/google/uuid"
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


func serviceHandler(server *server) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
		} else if r.Method == http.MethodPost {
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

			pollingId := uuid.New().String()

			pendingResponse := FclResponse{
				FType: "PollingResponse",
				FVsn: "1.0.0",
				Status: "PENDING",
				Updates: Service {
					FType: "PollingResponse",
					FVsn: "1.0.0",
					Type: "back-channel-rpc",
					Endpoint: "http://localhost:8701/api/polling-session",
					Method: "HTTP/GET",
					Params: map[string]string{
						"pollingId": pollingId,
					},
				},
			}

			pendingResponseJson, err := json.Marshal(pendingResponse)
			
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			pollingSessions[pollingId] = string(pendingResponseJson)

			responseJson, err := json.Marshal(ServicePostResponse{
				FclResponse: pendingResponse,
				Local: Service{
					FType: "Service",
					FVsn: "1.0.0",
					Type: "local-view",
					Endpoint: "http://localhost:8701/fcl/" + service,
					Method: "HTTP/GET",
					Params: map[string]string{
						"pollingId": pollingId,
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
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}
}