//go:build !js && !wasm
// +build !js,!wasm

package wallet

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

type server struct {
	http *http.Server
	config *FlowConfig
	pollingSessions []string
	pollingSessionsFile string
}

// NewHTTPServer returns a new wallet server listening on provided port number.
func NewHTTPServer(port uint, config *FlowConfig) (*server, error) {
	srv := &server{
		http: &http.Server{
			Addr: fmt.Sprintf(":%d", port),
			Handler: nil,
		},
		config: config,
		pollingSessions: make([]string, 0),
		pollingSessionsFile: nil,
	}

	srv.http.Handler = buildHandlers(srv)

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