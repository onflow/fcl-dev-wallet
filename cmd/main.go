package main

import (
	"fmt"

	wallet "github.com/onflow/fcl-dev-wallet"
)

func main() {
	srv, err := wallet.NewHTTPServer(8701, &wallet.Config{
		Address:    "f8d6e0586b0a20c7",
		PrivateKey: "f8e188e8af0b8b414be59c4a1a15cc666c898fb34d94156e9b51e18bfde754a5",
		PublicKey:  "6e70492cb4ec2a6013e916114bc8bf6496f3335562f315e18b085c19da659bdfd88979a5904ae8bd9b4fd52a07fc759bad9551c04f289210784e7b08980516d2",
		AccessNode: "http://localhost:8080",
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
