"use strict";
var regions = {
    485: "Москва",
    523: "Владимирская область",
    530: "Калужская область",
    536: "Ленинградская область",
    486: "Московская область",
    549: "Рязанская область",
    563: "Санкт-Петербург",
    554: "Смоленская область",
    556: "Тверская область",
    558: "Тульская область",
    562: "Ярославская область"
};
$(function() {
    var $select = $('#select').customSelect({
        regions: regions
    });

    $select.on('custom.select.updated', function(ev) {
        var regionid = ev.regionid;
        if (regionid) {
            $('#region').val(regionid);
        }
    });

    $('#changeBtn').click(function() {
        $select.trigger({
            type: 'custom.select.change',
            regionid: 562
        });
        // more simple way is just call changeValue function directly
        // $select.changeValue(562);
    });
});