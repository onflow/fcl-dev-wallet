package wallet

import (
	"net/http"
	"regexp"
	"strings"
)

// convertSnakeToCamel converts snake string format to camel string format.
func convertSnakeToCamel(input string) string {
	r, _ := regexp.Compile("_(\\w)")
	input = strings.ToLower(input)
	out := r.ReplaceAllFunc([]byte(input), func(s []byte) []byte {
		return []byte(strings.ToUpper(strings.ReplaceAll(string(s), "_", "")))
	})
	return string(out)
}

func getBaseUrl(r *http.Request) string {
	protocol := r.Header.Get("X-Forwarded-Proto")
	if(protocol == "") {
		protocol = "http"
	}

	host := r.Header.Get("X-Forwarded-Host")
	if(host == "") {
		host = r.Host
	}

	baseUrl := protocol + "://" + host
	return baseUrl
}