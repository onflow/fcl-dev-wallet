package app

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/onflow/fcl-dev-wallet/go/wallet/util"
)

// configHandler handles config endpoints
func (app *App) configHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	conf, err := buildConfig(app.config, app.envConfig)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	err = json.NewEncoder(w).Encode(conf)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
}

// buildConfig from provided flow config and the env config
func buildConfig(flowConfig *FlowConfig, envConfig []byte) (map[string]string, error) {
	env, _ := godotenv.Parse(bytes.NewReader(envConfig))

	flowConf, err := json.Marshal(flowConfig)
	if err != nil {
		return nil, err
	}


	var flow map[string]string
	err = json.Unmarshal(flowConf, &flow)
	if err != nil {
		return nil, err
	}

	tempt := make(map[string]string)

	for k, v := range env {
		tempt[util.ConvertSnakeToCamel(k)] = v
	}

	// don't overwrite empty values
	for k, v := range flow {
		if v != "" {
			tempt[k] = v
		}
	}

	return tempt, nil
}