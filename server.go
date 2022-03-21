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

type Server struct {
	http   *http.Server
	config *Config
}

// NewHTTPServer returns a new wallet server listening on provided port number.
func NewHTTPServer(port uint, config *Config) (*Server, error) {
	mux := http.NewServeMux()
	server := &Server{
		http: &http.Server{
			Addr:    fmt.Sprintf(":%d", port),
			Handler: mux,
		},
		config: config,
	}

	zipContent, _ := bundle.ReadFile(bundleZip)
	zipFS, _ := zip.NewReader(bytes.NewReader(zipContent), int64(len(zipContent)))
	rootFS := http.FS(zipFS)

	// handle /api endpoint returning the configuration
	mux.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		err := json.NewEncoder(w).Encode(server.config)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
	})

	mux.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
		path := strings.TrimPrefix(request.URL.Path, "/")

		// if not found and there is no / suffix (which would mean index.html) then try adding .html for file
		if path != "" {
			if _, err := zipFS.Open(path); err != nil {
				path = fmt.Sprintf("%s.html", path)
			}
		}

		request.URL.Path = path // overwrite path for file server handler
		http.FileServer(rootFS).ServeHTTP(writer, request)
	})

	return server, nil
}

func (s *Server) Start() error {
	return s.http.ListenAndServe()
}

func (s *Server) Stop() {
	_ = s.http.Shutdown(context.Background())
}
