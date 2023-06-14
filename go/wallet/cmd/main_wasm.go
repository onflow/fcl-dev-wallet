//go:build js && wasm
// +build js,wasm

package main

import (
	"fmt"

	"github.com/onflow/fcl-dev-wallet/go/wallet"
)

func main() {
	srv, err := wallet.NewHTTPServer(nil)
	if err != nil {
		panic(err)
	}

	fmt.Println("WASM HTTP server ready")
	srv.Start()
}
