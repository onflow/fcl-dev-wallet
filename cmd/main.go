package main

import (
	"fmt"
	wallet "github.com/onflow/fcl-dev-wallet"
)

func main() {
	srv, err := wallet.NewHTTPServer(8701, &wallet.Config{
		Address:    "f8d6e0586b0a20c7",
		PrivateKey: "68ee617d9bf67a4677af80aaca5a090fcda80ff2f4dbc340e0e36201fa1f1d8c",
		PublicKey:  "9cd98d436d111aab0718ab008a466d636a22ac3679d335b77e33ef7c52d9c8ce47cf5ad71ba38cedd336402aa62d5986dc224311383383c09125ec0636c0b042",
		AccessNode: "localhost:3569",
	})
	if err != nil {
		panic(err)
	}

	fmt.Println("Server started on port 8701, make sure you have the latest version of bundle.zip build before starting this server")

	err = srv.Start()
	if err != nil {
		panic(err)
	}

}
