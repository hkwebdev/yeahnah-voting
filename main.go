package main

import (
	"github.com/joho/godotenv"
	"os"
	"yeahnah/cms/server"
)

func init() {
	godotenv.Load(".env")
}

func main() {
	app := server.CreateApp()

	if err := app.Start(); err != nil {
		app.Logger().Error(err.Error())
		os.Exit(1)
	}
}
