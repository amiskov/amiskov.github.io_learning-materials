function Select(items, selectedId) {
    this._init(items, selectedId);
}; // Не нужно

Select.prototype.getElement = function() {
    if (!this._element) {
        this._makeElement();
    }

    return this._element;
};

Select.prototype.on = function(eventName, callback) {
    this.getElement().on(eventName, callback);
};

Select.prototype._init = function(items, selectedId) {
    this._items = items;
    this._selectedId = selectedId;
};

Select.prototype._makeElement = function() {
    this._element = jQuery('<div>', {'class': 'custom-select'}); // Лучше разнести по строкам, удобней читать будет
    this._selectedItem =
        jQuery('<span>', {
            class: 'custom-select__selected-item',
            text: this._items[this._selectedId]
        }).on('click', $.proxy(this, '_toggleMenu'));
        //}).on('click', function() {
        //    self._toggleMenu();
        //});

    this._element.append(this._selectedItem);
};

Select.prototype._checkOption = function(event) {
    var $target = jQuery(event.target);
    if (!$target.hasClass('js-custom-select-item')) { // Зачем эта проверка?
        return;
    }
    this._selectItem($target.data('id')); // если без проверки, то останется только это
};

Select.prototype._buildList = function() {
    this._itemList =
        jQuery('<ul>', {
            class: 'custom-select__list'
        })
            .hide()
            .on('click', $.proxy(this, '_checkOption'));
            //.on('click', function(event) {
            //    var $target = jQuery(event.target);
            //    if (!$target.hasClass('js-custom-select-item')) { // Зачем эта проверка?
            //        return;
            //    }
            //    self._selectItem($target.data('id'));
            //});
    this._element.append(this._itemList);

    for (key in this._items) {
        if (!this._items.hasOwnProperty(key)) {
            continue;
        }

        var item = jQuery('<li>', {
            class: 'custom-select__item js-custom-select-item',
            text: this._items[key]
        });
        item.data('id', key);
        this._itemList.append(item);
    }
};

Select.prototype._toggleMenu = function() {
    if (!this._itemList) {
        this._buildList();
    }

    this._itemList.toggle();
};

Select.prototype._selectItem = function(id) { // Зря он приватный. Эта штука нужна снаружи
    this._selectedId = id;
    this._selectedItem.text(this._items[id]);
    this._itemList.toggle();
    this.getElement().triggerHandler('change', [id, this._items[id]]);
};



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

var select = new Select(regions, 558);
select.on('change', function(e, id, value) {
    alert(id + ': ' + value);
});
$('#regions').append(select.getElement());

