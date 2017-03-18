'use strict';

var PkgListController = {

    $search: document.getElementById("txt-pkg-list-search"),
    $list: document.getElementById("pkg-list-content"),
    $t: document.getElementById("t-pkg-list"),
    $headerT: document.getElementById("t-pkg-list-header"),

    _pkgList: null,

    activate: function() {
        var $this = PkgListController;

        $this.$search.onkeydown = $this._onSearchKeyPress;
        $this.load();
    },

    /**
     * Loads the Package List.
     */
    load: function() {
        var $this = PkgListController;

        Loader.show()
        API.loadPkgList($this._onLoad);
    },

    /**
     * Called when the Package List is loaded to display the packages.
     *
     * @param err {Error}
     * @param res {Object}
     */
    _onLoad: function(err, res) {
        var $this = PkgListController;
        if (err) {
            console.error(err);
            return;
        }
        $this._pkgList = res;

        $this._render();
        Loader.hide();
    },

    /**
     * Renders the PkgList contents, filtered by search contents.
     */
    _render: function() {
        var $this = PkgListController,
            search = $this.$search.value.toLowerCase(),
            contents = [];

        var header = null;
        for (var i = 0; i < $this._pkgList.length; i++) {
            var pkg = $this._pkgList[i];

            if (search.length > 0 && pkg.name.toLowerCase().indexOf(search) === -1) {
                continue;
            }

            if (header == null || pkg.name.indexOf(header) !== 0) {
                var components = pkg.name.split("/");

                header = [components[0], components[1], components[2]].join("/");
                contents.push(Template.apply($this.$headerT, {
                    name: header
                }));
            }

            var displayName = pkg.name;
            if (displayName === header) {
                displayName = pkg.name.split("/").pop();
            } else {
                displayName = pkg.name.replace(header + "/", "");
            }

            contents.push(Template.apply($this.$t, {
                displayName: displayName,
                name: pkg.name,
            }));
        }

        $this.$list.innerHTML = contents.join("");
    },

    /**
     * Called when a package in the package list is selected.
     *
     * @param name {String}
     */
    onPkgSelected: function(name) {
        State.set(State.PkgDetails, {
            name: name
        });
    },

    /**
     * Called when the search input has a key-press event.
     *
     * @param e {Event}
     */
    _onSearchKeyPress: function(e) {
        var $this = PkgListController;
        $this._render();
    }

};