package wallet

import (
	"archive/zip"
	"bytes"
	"context"
	"embed"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

//go:embed bundle.zip
var bundle embed.FS

const bundleZip = "bundle.zip"

type Config struct {
	Address    string `json:"flowAccountAddress"`
	PrivateKey string `json:"flowAccountPrivateKey"`
	PublicKey  string `json:"flowAccountPublicKey"`
	AccessNode string `json:"flowAccessNode"`
}

type server struct {
	http   *http.Server
	config *Config
}

// NewHTTPServer returns a new wallet server listening on provided port number.
func NewHTTPServer(port uint, config *Config) (*server, error) {
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
		err := json.NewEncoder(w).Encode(server.config)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
	}
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

func (s *server) Start() error {
	return s.http.ListenAndServe()
}

func (s *server) Stop() {
	_ = s.http.Shutdown(context.Background())
}
