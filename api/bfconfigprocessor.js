
// curl -X POST -H "Content-Type: application/json" -d @config.json http://localhost:5001/api/bf_config

function process_config (bf_config, callback) {
  // Array of documents we will insert
  var devices_to_insert = []
  var locations_to_insert = []
  var stations_to_insert = []

  // Drop unused keys
  if ('_redirect' in bf_config) {
    delete bf_config._redirect
  }

  if ('locations' in bf_config) {
    var entries = Object.entries(bf_config.locations)
    for (const [key, val] of entries) {
      // Put shared devices into their own table
      if ('devices' in val) {
        val['devices'].forEach(e => {
          if (!('max_users' in e)) {
            e.max_users = 1
          }
          e.active_users = 0
          e.available_for_autotests = true
          e.location = key
          devices_to_insert.push(e)
        })
        delete val.devices
      }
      val.name = key
      locations_to_insert.push(val)
    }
    delete bf_config.locations
  }

  entries = Object.entries(bf_config)
  for (const [key, val] of entries) {
    val.name = key
    if (!('available_for_autotests' in val)) {
      val.available_for_autotests = true
    }
    if (!('feature' in val)) {
      val.feature = []
    }
    if (!('location' in val)) {
      val.location = 'local'
    }
    val.active_users = 0
    val.active_user = ''
    val.active_time = null,
    val.active_host = ''
    val.note = ''
    val.prev_user = ''
    val.prev_time = null,
    val.prev_host = ''
    val.total_uses = 0
    stations_to_insert.push(val)
  }

  callback(devices_to_insert, locations_to_insert, stations_to_insert)
}

module.exports.process_config = process_config
