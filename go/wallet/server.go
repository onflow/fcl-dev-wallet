package wallet

import (
	"embed"
	"net/http"

	"github.com/gorilla/mux"
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

func buildHandlers(srv *server) http.Handler {
	r := mux.NewRouter()

	r.HandleFunc("/api/", configHandler(srv))
	r.HandleFunc("/api/polling-session", pollingSessionHandler(srv))
	r.HandleFunc("/api/{service}", serviceHandler(srv))
	r.HandleFunc("/", devWalletHandler())

	return r
}

