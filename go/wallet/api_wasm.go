//go:build js && wasm
// +build js,wasm

package wallet

import (
	"embed"
	"net/http"
	"os"

	wasmhttp "github.com/nlepage/go-wasm-http-server"
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
	config *FlowConfig
}

// NewHTTPServer returns a new wallet API server.
func NewApiHTTPServer(config *FlowConfig) (*server, error) {
	srv := &server{
		config: config,
	}

	http.HandleFunc("/", configHandler(srv))
	http.HandleFunc("/polling-session", pollingSessionHandler(srv))
	http.HandleFunc("/{service}", serviceHandler(srv))
	
	return srv, nil
}

func (s *server) Start() {
	done := make(chan os.Signal, 1)

	go func() {
		wasmhttp.Serve(nil)
	}()

	<-done
}
