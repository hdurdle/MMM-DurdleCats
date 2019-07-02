Module.register('MMM-DurdleCats', {

  defaults: {
    refresh: 5
  },

  getStyles: function () {
    return ["MMM-DurdleCats.css"];
  },

  getScripts: function () {
    return ["moment.js"];
  },

  capFirst: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  start: function () {
    Log.info('Starting module: ' + this.name);
    this.sendSocketNotification('MMM-DURDLECATS-CONFIG', this.config);
    this.cats = [];
    this.getCats();
    this.timer = null;
  },

  getCats: function () {
    clearTimeout(this.timer);
    this.timer = null;
    this.sendSocketNotification("MMM-DURDLECATS-GET", {
      instanceId: this.identifier
    });

    var self = this;
    this.timer = setTimeout(function () {
      self.getCats();
    }, this.config.refresh * 60 * 1000);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification == "MMM-DURDLECATS-RESPONSE" + this.identifier && payload.length > 0) {
      this.cats = payload;
      this.updateDom(1000);
    }
  },

  getDom: function () {
    var wrapper = document.createElement("div");

    if (this.cats.length == 0) {
      wrapper.innerHTML = this.translate("LOADING");
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    for (i = 0; i < this.cats.length; i++) {

      var cat = this.cats[i];
      // check if we need to exclude cats listed in the exclude config
      if (this.config.exclude.includes(cat.name)) {
        continue;
      }

      var catContainer = document.createElement("div");
      catContainer.classList.add("durdlecats-container");

      var nameContainer = document.createElement("span");
      nameContainer.classList.add("durdlecats-name");
      nameContainer.innerHTML = cat.name;
      catContainer.appendChild(nameContainer);

      var sinceContainer = document.createElement("span");
      sinceContainer.classList.add("durdlecats-date");
      sinceContainer.innerHTML = cat.since_moment;

      catContainer.appendChild(sinceContainer);

      var iconContainer = document.createElement("span");
      iconContainer.classList.add("durdlecats-icon-container");
      iconContainer.classList.add("fas");
      iconContainer.classList.add(cat.location_icon);

      catContainer.appendChild(iconContainer);

      wrapper.appendChild(catContainer);

    };

    return wrapper;
  }

});