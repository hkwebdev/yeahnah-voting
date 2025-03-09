package server

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "yeahnah/cms/migrations"
	. "yeahnah/cms/utils"
)

type App struct {
	*pocketbase.PocketBase
}

// CreateApp is the main entry point for the app
// It initializes the app and configures it
// You may add more configurations here as needed
func CreateApp() *App {
	env := ReadEnv("ENV", "prod")

	base := pocketbase.NewWithConfig(pocketbase.Config{
		DefaultDev:     true,
		DefaultDataDir: "./.data/pb_data." + env + ".db",
	})

	app := &App{
		base,
	}

	migratecmd.MustRegister(base, base.RootCmd, migratecmd.Config{
		Automigrate: env == "dev",
		Dir:         "cms/migrations",
	})

	base.OnServe().BindFunc(func(e *core.ServeEvent) error {
		// if err := ConfigureSecurityRules(app); err != nil {
		// 	return err
		// }

		MountRoutes(app, e.Router)
		return e.Next()
	})

	return app
}
