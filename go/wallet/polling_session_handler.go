package wallet

import (
	"encoding/json"
	"net/http"
)

var pollingSessions = make(map[string]string)

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

			pollingSessions[req.PollingId] = req.Data
			
			w.WriteHeader(http.StatusCreated)
		} else if r.Method == http.MethodGet {
			pollingId := r.URL.Query().Get("pollingId")
			if pollingId == "" {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			
			if _, ok := pollingSessions[pollingId]; !ok {
				w.WriteHeader(http.StatusNotFound)
			} else {
				w.WriteHeader(http.StatusOK)
				w.Header().Set("Content-Type", "application/json")
				w.Write([]byte(pollingSessions[pollingId]))
				// TODO: delete polling session if approved
			}
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}
}