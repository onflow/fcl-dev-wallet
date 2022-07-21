package wallet

import (
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
