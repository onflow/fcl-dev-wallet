package app

import (
	"embed"
	"net/http"

	"github.com/gorilla/mux"
)

type App struct {
	Handler http.Handler
	config *FlowConfig
	bundle embed.FS
	bundleZip string
	envConfig []byte
	pollingSessions map[int]string
	nextPollingId int
}

type FlowConfig struct {
	Address    string `json:"flowAccountAddress"`
	PrivateKey string `json:"flowAccountPrivateKey"`
	PublicKey  string `json:"flowAccountPublicKey"`
	AccessNode string `json:"flowAccessNode"`
	AvatarUrl string `json:"flowAvatarUrl"`
}

func NewApp(config *FlowConfig, bundle embed.FS, bundleZip string, envConfig []byte) *App {
	app := &App{
		Handler: nil,
		config: config,
		bundle: bundle,
		bundleZip: bundleZip,
		envConfig: envConfig,
		pollingSessions: make(map[int]string),
		nextPollingId: 0,
	}

	r := mux.NewRouter()

	// API routes
	apiRouter := r.PathPrefix("/api").Subrouter()
	apiRouter.HandleFunc("/", app.configHandler).Methods("GET")
	apiRouter.HandleFunc("/polling-session", app.getPollingSessionHandler).Methods("GET")
	apiRouter.HandleFunc("/polling-session", app.postPollingSessionHandler).Methods("POST")
	apiRouter.HandleFunc("/{service}", app.postServiceHandler).Methods("POST")

	// Main route
	r.PathPrefix("/").HandlerFunc(app.devWalletHandler).Methods("GET")

	app.Handler = enableCors(r)

	return app
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