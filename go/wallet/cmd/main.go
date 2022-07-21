package main

import (
	"fmt"
	"github.com/onflow/fcl-dev-wallet/go/wallet"
)

func main() {
	srv, err := wallet.NewHTTPServer(8701, nil)
	if err != nil {
		panic(err)
	}

	fmt.Println("Development server started on port 8701")
	srv.Start()
}
