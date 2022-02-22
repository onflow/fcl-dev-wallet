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

//go:embed out/bundle.zip
var bundle embed.FS

const bundleZip = "out/bundle.zip"

type Config struct {
	Address    string `json:"address"`
	PrivateKey string `json:"privateKey"`
	PublicKey  string `json:"publicKey"`
	AccessNode string `json:"accessNode"`
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

	// handle /api endpoint returning the configuration
	mux.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		err := json.NewEncoder(w).Encode(server.config)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
	})

	// file server handler with custom wrapper trying to add .html file extension if file not found
	mux.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
		path := strings.TrimPrefix(request.URL.Path, "/")
		_, err := zipFS.Open(path) // just check if file is actually found
		// if not found and there is no / suffix (which would mean index.html) then try adding .html for file
		if err != nil && strings.HasSuffix(path, "/") {
			path = fmt.Sprintf("%s.html", path)
		}

		request.URL.Path = path // overwrite path for file server handler
		http.FileServer(http.FS(zipFS)).ServeHTTP(writer, request)
	})

	return server, nil
}

func (s *Server) Start() error {
	return s.http.ListenAndServe()
}

func (s *Server) Stop() {
	_ = s.http.Shutdown(context.Background())
}
