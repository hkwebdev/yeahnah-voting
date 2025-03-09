package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `{
			"createRule": null,
			"deleteRule": null,
			"fields": [
				{
					"autogeneratePattern": "[a-z0-9]{15}",
					"hidden": false,
					"id": "text3208210256",
					"max": 15,
					"min": 15,
					"name": "id",
					"pattern": "^[a-z0-9]+$",
					"presentable": false,
					"primaryKey": true,
					"required": true,
					"system": true,
					"type": "text"
				},
				{
					"cascadeDelete": false,
					"collectionId": "pbc_424458908",
					"hidden": false,
					"id": "relation2283783542",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "artwork",
					"presentable": true,
					"required": true,
					"system": false,
					"type": "relation"
				},
				{
					"cascadeDelete": false,
					"collectionId": "pbc_1687431684",
					"hidden": false,
					"id": "relation1001261735",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "event",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "relation"
				},
				{
					"exceptDomains": [],
					"hidden": false,
					"id": "email3885137012",
					"name": "email",
					"onlyDomains": [],
					"presentable": false,
					"required": false,
					"system": false,
					"type": "email"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text3065852031",
					"max": 0,
					"min": 0,
					"name": "message",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": false,
					"system": false,
					"type": "text"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text1579384326",
					"max": 0,
					"min": 0,
					"name": "name",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": false,
					"system": false,
					"type": "text"
				},
				{
					"hidden": false,
					"id": "bool2611151064",
					"name": "yeahnah",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "bool"
				},
				{
					"hidden": false,
					"id": "autodate2990389176",
					"name": "created",
					"onCreate": true,
					"onUpdate": false,
					"presentable": false,
					"system": false,
					"type": "autodate"
				},
				{
					"hidden": false,
					"id": "autodate3332085495",
					"name": "updated",
					"onCreate": true,
					"onUpdate": true,
					"presentable": false,
					"system": false,
					"type": "autodate"
				}
			],
			"id": "pbc_2597176356",
			"indexes": [
				"CREATE INDEX ` + "`" + `idx_a17URD65YA` + "`" + ` ON ` + "`" + `votes` + "`" + ` (\n  ` + "`" + `event` + "`" + `,\n  ` + "`" + `artwork` + "`" + `\n)",
				"CREATE INDEX ` + "`" + `idx_B1LDYJWklb` + "`" + ` ON ` + "`" + `votes` + "`" + ` (` + "`" + `artwork` + "`" + `)",
				"CREATE INDEX ` + "`" + `idx_geMoVwOGUz` + "`" + ` ON ` + "`" + `votes` + "`" + ` (` + "`" + `event` + "`" + `)"
			],
			"listRule": null,
			"name": "votes",
			"system": false,
			"type": "base",
			"updateRule": null,
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2597176356")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
