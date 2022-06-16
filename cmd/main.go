package main

import (
	"fmt"

	wallet "github.com/onflow/fcl-dev-wallet"
)

func main() {
	srv, err := wallet.NewHTTPServer(8701, &wallet.Config{
		Address:    "0xf8d6e0586b0a20c7",
		PrivateKey: "823fe26eb8346f86441410ffc41924f8733def3841281a88fda10845bf363251",
		PublicKey:  "03609dc83c9a0ee8fe8ebf74d9fb3da37509fee6d7fb5bd2e99dadf7729b3cdaf64564040cd8d9a516e7615caf0685e112e8650798cc59e5f8aeeae2bd227fdb",
		KeyID:      "0",
		AccessNode: "http://localhost:8888",
	})
	if err != nil {
		panic(err)
	}

	fmt.Println("Server started on port 8701, make sure you have the latest version of bundle.zip build before starting this server")

	srv.Start()
}
