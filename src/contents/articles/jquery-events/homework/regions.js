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


var select = new Select(regions, selectedId);

$('#regions').html(select.getElement()); // => <div class="...">...</div>

select.on('change', function (e) {
    $('#title').html(e.data.value);
});


function createElement() {
    var $el = $('#select');

    var $html = $('<ul/>', {
        class: 'select',
        text: 'Москва'
    });
     // Цикл для вставки li

    $el.html($html);

    $el.trigger('ready');

}
