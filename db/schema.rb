# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150916162754) do

  create_table "servers", force: :cascade do |t|
    t.string  "label"
    t.string  "host"
    t.boolean "status"
  end

  create_table "servers_services", id: false, force: :cascade do |t|
    t.integer "server_id"
    t.integer "service_id"
  end

  add_index "servers_services", ["server_id"], name: "index_servers_services_on_server_id"
  add_index "servers_services", ["service_id"], name: "index_servers_services_on_service_id"

  create_table "services", force: :cascade do |t|
    t.string  "name"
    t.string  "service_type"
    t.integer "server_count"
    t.text    "log_path"
  end

end
