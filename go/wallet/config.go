package wallet

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/joho/godotenv"
)

// configHandler handles config endpoints
func configHandler(server *server) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		conf, err := buildConfig(server.config)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}

		err = json.NewEncoder(w).Encode(conf)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
	}
}

// buildConfig from provided flow config and the env config
func buildConfig(flowConfig *FlowConfig) (map[string]string, error) {
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
		tempt[convertSnakeToCamel(k)] = v
	}

	// don't overwrite empty values
	for k, v := range flow {
		if v != "" {
			tempt[k] = v
		}
	}

	return tempt, nil
}