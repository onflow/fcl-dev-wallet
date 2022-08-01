package wallet

import (
	"archive/zip"
	"bytes"
	"context"
	"embed"
	"encoding/json"
	"fmt"
	"github.com/joho/godotenv"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"golang.org/x/exp/maps"
)

//go:embed bundle.zip
var bundle embed.FS

//go:embed .env.development
var envConfig []byte

const bundleZip = "bundle.zip"

type FlowConfig struct {
	Address    string `json:"flowAccountAddress"`
	PrivateKey string `json:"flowAccountPrivateKey"`
	PublicKey  string `json:"flowAccountPublicKey"`
	AccessNode string `json:"flowAccessNode"`
}

type server struct {
	http   *http.Server
	config *FlowConfig
}

// NewHTTPServer returns a new wallet server listening on provided port number.
func NewHTTPServer(port uint, config *FlowConfig) (*server, error) {
	mux := http.NewServeMux()
	srv := &server{
		http: &http.Server{
			Addr:    fmt.Sprintf(":%d", port),
			Handler: mux,
		},
		config: config,
	}

	mux.HandleFunc("/api/", configHandler(srv))
	mux.HandleFunc("/", devWalletHandler())

	return srv, nil
}

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
	env, err := godotenv.Parse(bytes.NewReader(envConfig))

	flowConf, err := json.Marshal(flowConfig)
	if err != nil {
		return nil, err
	}

	var flow map[string]string
	err = json.Unmarshal(flowConf, &flow)
	if err != nil {
		return nil, err
	}

	for k, v := range env {
		delete(env, k)
		env[convertSnakeToCamel(k)] = v
	}

	// don't overwrite empty values
	for k, v := range flow {
		if v == "" {
			delete(flow, k)
		}
	}

	maps.Copy(env, flow)
	return env, nil
}

// devWalletHandler handles endpoints to exported static html files
func devWalletHandler() func(writer http.ResponseWriter, request *http.Request) {
	zipContent, _ := bundle.ReadFile(bundleZip)
	zipFS, _ := zip.NewReader(bytes.NewReader(zipContent), int64(len(zipContent)))
	rootFS := http.FS(zipFS)

	return func(writer http.ResponseWriter, request *http.Request) {
		path := strings.TrimPrefix(request.URL.Path, "/")
		if path != "" { // api requests don't include .html so that needs to be added
			if _, err := zipFS.Open(path); err != nil {
				path = fmt.Sprintf("%s.html", path)
			}
		}

		request.URL.Path = path
		http.FileServer(rootFS).ServeHTTP(writer, request)
	}
}

func (s *server) Start() {
	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		err := s.http.ListenAndServe()
		if err != nil {
			fmt.Printf("error starting up the server: %s\n", err)
			done <- syscall.SIGTERM
		}
	}()

	<-done
	s.Stop()
}

func (s *server) Stop() {
	_ = s.http.Shutdown(context.Background())
}
