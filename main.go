package wallet

import (
	"context"
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"net/http"
)

//go:embed out
var bundle embed.FS

const baseDir = "out"

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

	subFs, err := fs.Sub(bundle, baseDir)
	if err != nil {
		return nil, err
	}

	mux.HandleFunc("/api/", server.apiHandler)
	mux.Handle("/", http.FileServer(http.FS(subFs)))

	return server, nil
}

func (s *Server) Start() error {
	return s.http.ListenAndServe()
}

func (s *Server) Stop() {
	_ = s.http.Shutdown(context.Background())
}

func (s *Server) apiHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err := json.NewEncoder(w).Encode(s.config)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
}
