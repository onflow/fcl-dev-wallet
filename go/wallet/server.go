package wallet

import (
	"context"
	"embed"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/gorilla/mux"
)

//go:embed bundle.zip
var bundle embed.FS

//go:embed .env.development
var envConfig []byte

const bundleZip = "bundle.zip"
type server struct {
	http *http.Server
	config *FlowConfig
	bundle embed.FS
	bundleZip string
	pollingSessions map[int]map[string]interface{}
	nextPollingId int
}

type FlowConfig struct {
	Address    string `json:"flowAccountAddress"`
	PrivateKey string `json:"flowAccountPrivateKey"`
	PublicKey  string `json:"flowAccountPublicKey"`
	AccessNode string `json:"flowAccessNode"`
	AvatarUrl string `json:"flowAvatarUrl"`
}

// NewHTTPServer returns a new wallet server listening on provided port number.
func NewHTTPServer(port uint, config *FlowConfig) (*server, error) {
	http := http.Server{
		Addr: fmt.Sprintf(":%d", port),
		Handler: nil,
	}

	srv := &server{
		http: &http,
		config: config,
		bundle: bundle,
		bundleZip: bundleZip,
		pollingSessions: make(map[int]map[string]interface{}),
		nextPollingId: 0,
	}

	r := mux.NewRouter()

	// API routes
	apiRouter := r.PathPrefix("/api").Subrouter()
	apiRouter.HandleFunc("/", srv.configHandler).Methods("GET")
	apiRouter.HandleFunc("/polling-session", srv.getPollingSessionHandler).Methods("GET")
	apiRouter.HandleFunc("/polling-session", srv.postPollingSessionHandler).Methods("POST")
	apiRouter.HandleFunc("/discovery", srv.discoveryHandler)
	apiRouter.HandleFunc("/{service}", srv.postServiceHandler).Methods("POST")

	// Main route
	r.PathPrefix("/").HandlerFunc(srv.devWalletHandler).Methods("GET")

	srv.http.Handler = enableCors(r)

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

func enableCors(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Add the necessary CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// If it's a preflight request, respond with 200 OK
		if r.Method == http.MethodOptions {
			return
		}

		// Call the next handler
		handler.ServeHTTP(w, r)
	})
}