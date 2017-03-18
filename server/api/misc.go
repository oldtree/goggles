package api

import (
	"fmt"
	"net/http"
)

// debug opens the developer tools for debugging.
func debug(w http.ResponseWriter, r *http.Request) {
	if devTools != nil {
		devTools.OpenDevTools()
	}

	fmt.Fprintf(w, "{}")
}