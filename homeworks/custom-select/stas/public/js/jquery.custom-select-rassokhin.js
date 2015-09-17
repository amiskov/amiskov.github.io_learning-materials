"use strict";
$.fn.customSelect = function (opts) {
    var _this  = this,
        $title = this.find('.js-select-title'),
        $list  = this.find('.js-select-list');

    // will use local regions var, can set default values in future
    var options = $.extend({
        // defaul options
        regions: {}
    }, opts);

    // func to append items with regions to empty list
    function populateSelect() {
        // create buffer mas to collect all li elements and then add them in the end
        var liMas = [];
        for (var key in options.regions) {
            if (options.regions.hasOwnProperty(key)) {
                var $li = $('<li></li>');
                $li.addClass('select-custom__item js-select-item').attr('data-id', key).text(regions[key]);
                liMas.push($li);
            }
        }
        // only one call to DOM
        $list.append(liMas);
    }

    // hide regions list
    this.hideList = function() {
        $list.removeClass('visible');
    };

    // hide/show regions list
    this.toggleList = function() {
        $list.toggleClass('visible');
    };

    // update custome select title
    function updateTitle(text) {
        $title.text(text);
    }

    // func to change current active region
    this.changeValue = function(regionid) {
        var $li = $list.find('.js-select-item[data-id="' + regionid + '"]');
        if ($li.length) {
            updateTitle($li.text());
            // trigger change event outside with selected region id
            _this.trigger({
                type: 'custom.select.updated',
                regionid: regionid
            })
        }
    };

    function bindEvents() {
        // hide/show regions list
        $title.on('click', _this.toggleList);
        // click on region item in list
        $list.on('click', '.js-select-item', function() {
            var $this = $(this);
            _this.hideList();
            updateTitle($this.text());
            _this.trigger({
                type: 'custom.select.updated',
                regionid: $this.attr('data-id')
            });
        });
        // handle change event from outside, equal to $('#element').changeValue(xxx)
        _this.on('custom.select.change', function(ev) {
            var regionid = ev.regionid;
            if (regionid) {
                _this.changeValue(regionid);
            }
        });
    }

    populateSelect();
    bindEvents();

    return this;
};