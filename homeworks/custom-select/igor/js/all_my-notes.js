'use strict';

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

function Select(regions, selectedId) {
    this.regions = regions;
    this.selectedId = selectedId;
    this.getElement = getElement;
    this.changeSelected = changeSelected;

    // ! Это можно делать в методе .getElement, чтобы не засорять память
    var $select = $('<div/>').addClass('select'),
        $selectTitle = $('<span/>').addClass('select__title'),
        $selectList = $('<ul/>').addClass('select__list');

    // ? Почему не сделать то, что в init прямо в getElement
    init.call(this);
    function init() {
        if(this.selectedId) {
            this.changeSelected(this.selectedId);
        }

        $select.append($selectTitle).append($selectList);

        $.each(this.regions, function(key, val) {
            var $li = $('<li/>').addClass('select__item'),
                $link = $('<a/>').attr('href', '#').addClass('select__link js-select-link').data('id', key).text(val);
            $selectList.append($li.append($link));
        });

        bindEvents.call(this);
    }

    function bindEvents() {
        $select.on('click', '.js-select-link', linkHandler.bind(this));
        $selectTitle.on('click', toggleHandler.bind(this));
        $(document).on('click', documentHandler.bind(this));
    }

    function linkHandler(ev) {
        ev.preventDefault();
        var $target = $(ev.currentTarget),
            id = $target.data('id');
        this.changeSelected(id);
    }

    function changeSelected(_id) {
        var el = this.regions[_id];

        if(el) {
            this.selectedId = Number(_id);
            $selectTitle.text(el);
        }

        $(this).triggerHandler('change', this.selectedId);
        $select.removeClass('_open'); // ? Почему класс с подчеркиванием
    }

    function toggleHandler(ev) {
        ev.preventDefault();
        $select.toggleClass('_open');
    }

    function documentHandler(ev) {
        var $target = $(ev.target),
            openSelect = $select.hasClass('_open'),
            childSelect = $target.closest('.select').length;

        if ( openSelect && !childSelect) {
            $select.removeClass('_open');
        }
    }

    function getElement() {
        return $select;
    }

    return $.extend(this, $({}));
}

$(function() {
    var select = new Select(regions, 523);

    select.on('change', function(ev, data) {
        console.log('change select', data);
    });

    $('#regions').append(select.getElement());

    $('.js-change-select').click(function(ev) {
        var id = $(ev.currentTarget).data('id');
        select.changeSelected(id);
    });
});

