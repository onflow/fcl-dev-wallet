package wallet

import (
	"archive/zip"
	"bytes"
	"context"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"mime"
	"net/http"
	"path/filepath"
	"strings"
)

//go:embed bundle.zip
var bundle embed.FS

const bundleZip = "bundle.zip"

type Config struct {
	Address    string `json:"flowAddress"`
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
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		upath := r.URL.Path

		if !strings.HasPrefix(upath, "/") {
			upath = "/" + upath
			r.URL.Path = upath
		}
		if strings.HasSuffix(upath, "/") {
			upath = "/index.html"
			r.URL.Path = upath
		}

		file, err := zipFS.Open(upath[1:])

		if err != nil {
			//try with .html suffix
			upath = upath + ".html"
			file, err = zipFS.Open(upath[1:])
			if err != nil {
				w.WriteHeader(500)
				return
			}
		}

		//detect mime type
		extension := filepath.Ext(upath)
		mimeType := mime.TypeByExtension("." + extension)
		if mimeType != "" {
			w.Header().Add("Content-Type", mimeType)
		}

		fileStat, _ := file.Stat()
		target := fileStat.Size()
		var buffer []byte = make([]byte, 32768)

		for target > 0 {
			count, _ := file.Read(buffer)
			_, err := w.Write(buffer[:count])
			if err != nil {
				return
			}
			target = target - int64(count)
		}

	})

	return server, nil
}

func (s *Server) Start() error {
	err := s.http.ListenAndServe()
	if errors.Is(err, http.ErrServerClosed) {
		return nil
	}

	return err
}

func (s *Server) Stop() {
	_ = s.http.Shutdown(context.Background())
}
