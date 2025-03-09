package server

import (
	"os"
	"path/filepath"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

func MountRoutes(app *App, router *router.Router[*core.RequestEvent]) error {
	executablePath, err := os.Executable()
	if err != nil {
		return err
	}

	executableDir := filepath.Dir(executablePath)
	publicDir := filepath.Join(executableDir, "public")

	if _, err := os.Stat(publicDir); os.IsNotExist(err) {
		return err
	}

	router.GET("/{path...}", apis.Static(os.DirFS(publicDir), true))

	return nil
}
