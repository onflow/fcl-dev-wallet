package wallet

import (
	"context"
	"embed"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/onflow/fcl-dev-wallet/go/wallet/app"
)

//go:embed bundle.zip
var bundle embed.FS

//go:embed .env.development
var envConfig []byte

const bundleZip = "bundle.zip"
type server struct {
	http *http.Server
	app *app.App
}

// NewHTTPServer returns a new wallet server listening on provided port number.
func NewHTTPServer(port uint, config *app.FlowConfig) (*server, error) {
	app := app.NewApp(config, bundle, bundleZip, envConfig)
	http := http.Server{
		Addr: fmt.Sprintf(":%d", port),
		Handler: app.Handler,
	}

	srv := &server{
		http: &http,
		app: app,
	}

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