package wallet

import (
	"encoding/json"
	"net/http"
	"strconv"
)

type UpdatePollingSessionRequest struct {
	PollingId string `json:"pollingId"`
	Data string `json:"data"`
}

func pollingSessionHandler(server *server) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
		} else if r.Method == http.MethodPost {
			var req UpdatePollingSessionRequest
			err := json.NewDecoder(r.Body).Decode(&req)

			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			pollingId, err := strconv.Atoi(req.PollingId)

			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			server.pollingSessions[pollingId] = req.Data
			
			w.WriteHeader(http.StatusCreated)
		} else if r.Method == http.MethodGet {
			pollingId, err := strconv.Atoi(r.URL.Query().Get("pollingId"))
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			
			if len(server.pollingSessions) <= pollingId {
				w.WriteHeader(http.StatusNotFound)
			} else {
				w.WriteHeader(http.StatusOK)
				w.Header().Set("Content-Type", "application/json")
				w.Write([]byte(server.pollingSessions[pollingId]))
				// TODO: delete polling session if approved
			}
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}
}