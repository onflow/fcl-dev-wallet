//go:build js && wasm
// +build js,wasm

package wallet

import (
	"net/http"

	wasmhttp "github.com/nlepage/go-wasm-http-server"
)

type server struct {
	handler http.Handler
	config *FlowConfig
	pollingSessions []string
	pollingSessionsFile string
}

// NewHTTPServer returns a new wallet API server.
func NewHTTPServer(config *FlowConfig) (*server, error) {
	srv := &server{
		handler: nil,
		config: config,
		pollingSessions: make([]string, 0),
		pollingSessionsFile: "./polling_sessions.tmp",
	}
	srv.handler = buildHandlers(srv)
	
	return srv, nil
}

func (s *server) Start() {
	wasmhttp.Serve(s.handler)
	select {}
}