package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_424458908")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"indexes": [
				"CREATE UNIQUE INDEX ` + "`" + `idx_5Y3QoiXowY` + "`" + ` ON ` + "`" + `artworks` + "`" + ` (` + "`" + `name` + "`" + `)"
			],
			"name": "artworks"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_424458908")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"indexes": [
				"CREATE UNIQUE INDEX ` + "`" + `idx_5Y3QoiXowY` + "`" + ` ON ` + "`" + `artwork` + "`" + ` (` + "`" + `name` + "`" + `)"
			],
			"name": "artwork"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
