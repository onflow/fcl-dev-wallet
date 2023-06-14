package app

import (
	"archive/zip"
	"bytes"
	"fmt"
	"net/http"
	"strings"
)

// devWalletHandler handles endpoints to exported static html files
func (app *App) devWalletHandler(writer http.ResponseWriter, request *http.Request) {
	zipContent, _ := app.bundle.ReadFile(app.bundleZip)
	zipFS, _ := zip.NewReader(bytes.NewReader(zipContent), int64(len(zipContent)))
	rootFS := http.FS(zipFS)

	path := strings.TrimPrefix(request.URL.Path, "/")
	if path != "" { // api requests don't include .html so that needs to be added
		if _, err := zipFS.Open(path); err != nil {
			path = fmt.Sprintf("%s.html", path)
		}
	}

	writer.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	writer.Header().Set("Pragma", "no-cache")
	writer.Header().Set("Expires", "0")

	request.URL.Path = path
	http.FileServer(rootFS).ServeHTTP(writer, request)
}