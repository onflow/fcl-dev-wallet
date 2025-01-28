package main

import (
	"fmt"

	"github.com/onflow/fcl-dev-wallet/go/wallet"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

func main() {
	var port uint
	rootCmd := &cobra.Command{
		Use:   "wallet",
		Short: "Flow Dev Wallet",
		Long:  `Flow Dev Wallet`,
		Run: func(cmd *cobra.Command, args []string) {
			srv, err := wallet.NewHTTPServer(port, nil)
			if err != nil {
				panic(err)
			}

			fmt.Printf("Development server started on port %d\n", port)
			srv.StartStandalone()
		},
	}

	rootCmd.PersistentFlags().UintVar(&port, "port", 8701, "Port to run the server on")
	viper.BindPFlag("port", rootCmd.PersistentFlags().Lookup("port"))

	if err := rootCmd.Execute(); err != nil {
		panic(err)
	}
}
