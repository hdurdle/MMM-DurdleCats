var NodeHelper = require("node_helper");
var axios = require('axios');

module.exports = NodeHelper.create({

  start: function () {
    console.log("Starting node_helper for module: " + this.name);
    this.cats = null;
  },

  socketNotificationReceived: function (notification, payload) {

    var self = this;
    if (notification == "MMM-DURDLECATS-CONFIG") {
      self.config = payload;
    } else if (notification == "MMM-DURDLECATS-GET") {
      axios.get(self.config.apiUri)
        .then(function (response) {
          // handle success
          self.cats = response.data;
          self.parseCats(payload);
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
    }
  },

  parseCats: function (payload) {
    this.sendSocketNotification('MMM-DURDLECATS-RESPONSE' + payload.instanceId, this.cats);
  }

});