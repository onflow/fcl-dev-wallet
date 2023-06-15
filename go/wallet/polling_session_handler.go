package wallet

import (
	"encoding/json"
	"net/http"
	"strconv"
)

type UpdatePollingSessionRequest struct {
	PollingId string `json:"pollingId"`
	Data map[string]interface{} `json:"data"`
}

func (srv *server) getPollingSessionHandler(w http.ResponseWriter, r *http.Request) {
	pollingId, err := strconv.Atoi(r.URL.Query().Get("pollingId"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	
	if _, ok := srv.pollingSessions[pollingId]; !ok {
		w.WriteHeader(http.StatusNotFound)
	} else {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		pollingSession := srv.pollingSessions[pollingId]

		obj, err := json.Marshal(pollingSession)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Write(obj)

		if pollingSession["status"] == "APPROVED" || pollingSession["status"] == "DECLINED" {
			delete(srv.pollingSessions, pollingId)
		}
	}
}

func (srv *server) postPollingSessionHandler(w http.ResponseWriter, r *http.Request) {
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

	srv.pollingSessions[pollingId] = req.Data
	
	w.WriteHeader(http.StatusCreated)
}