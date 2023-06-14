package app

import (
	"encoding/json"
	"net/http"
	"strconv"
)

type UpdatePollingSessionRequest struct {
	PollingId string `json:"pollingId"`
	Data string `json:"data"`
}

func (app *App) getPollingSessionHandler(w http.ResponseWriter, r *http.Request) {
	pollingId, err := strconv.Atoi(r.URL.Query().Get("pollingId"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	
	if _, ok := app.pollingSessions[pollingId]; !ok {
		w.WriteHeader(http.StatusNotFound)
	} else {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		src_json := []byte(app.pollingSessions[pollingId])
    var obj map[string]interface{}
    err := json.Unmarshal(src_json, &obj)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Write([]byte(app.pollingSessions[pollingId]))

		if obj["status"] == "APPROVED" || obj["status"] == "DECLINED" {
			delete(app.pollingSessions, pollingId)
		}
	}
}

func (app *App) postPollingSessionHandler(w http.ResponseWriter, r *http.Request) {
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

	app.pollingSessions[pollingId] = req.Data
	
	w.WriteHeader(http.StatusCreated)
}