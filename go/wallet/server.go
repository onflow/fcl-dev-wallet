//go:build !js && !wasm
// +build !js,!wasm

package wallet

import (
	"context"
	"embed"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
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
	AvatarUrl string `json:"flowAvatarUrl"`
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
	mux.HandleFunc("/api/polling-session", pollingSessionHandler(srv))
	mux.HandleFunc("/api/{service}", serviceHandler(srv))
	mux.HandleFunc("/", devWalletHandler())


	return srv, nil
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
