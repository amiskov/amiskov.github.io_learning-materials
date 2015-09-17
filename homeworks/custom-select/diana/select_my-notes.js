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


function Select(obj, selectedId) {
    // ! Можно и без этого
    // Чем больше предпосылок для непонтяного, тем более непонятно получится
    this.$select = null;
    this.$selectTitle = null;
    // ...


    // ? Почему решила использовать слово Cache в названии
    function initCache() {
        this.$select = $('<div class="select">');
        this.$selectTitle = $('<span class="js-region-selected select__title"/>');
        this.$selectList = $('<ul class="js-region-list select-list"/>');
        this.$container = $('#container');
        this.$btn = $('.js-btn');
    }

    function createSelect(obj, selectedId) {
        _this.$select.append(_this.$selectTitle);
        _this.$select.append(_this.$selectList);
        _this.$select.appendTo(_this.$container);

        for (var i in obj) {
            var $selectItem = $('<li class="js-region-item select-list__item"/>');
            $selectItem.attr('data-id', i);
            $selectItem.text(obj[i]);
            $selectItem.appendTo(_this.$selectList);
        };

        _this.$selectTitle.text(obj[selectedId]);
    }

    function openSelectList() {
        _this.$selectTitle.on('click', function() {
            _this.$selectList.toggleClass('_active');
        });
    }

    function chooseRegion() {
        var $regionItem = _this.$container.find('.js-region-item');

        $regionItem.on('click', function(ev) {
            var $this = $(ev.currentTarget);
            _this.$selectTitle.text($this.text());
            _this.$selectList.toggleClass('_active');
        });

        $(_this).trigger('change');


        // ! chooseRegion и changeRegion — должны делать одно и то же. Тут дублирование кода получается
    }

    function clickOutside() {
        $(document).on('click', function(e) {
            var target = $(e.target);

            if(!target.hasClass('js-region-selected') && !target.hasClass('js-region-list')) {
                _this.$selectList.removeClass('_active');
            }
        });

        console.log(_this);

    }

    this.changeRegion = function(id) {
        var $regionItem = _this.$container.find('.js-region-item');
        _this.$selectTitle.text(obj[id]);

        $(_this).trigger('change');
    }

    this.getElement = function() {
        return _this.$select;
    }

    initCache(); // ! Нет инита, нет возни с _this

    createSelect(obj, selectedId);
    openSelectList();
    chooseRegion();
    clickOutside();
}

var select = new Select(regions, 485);

$('body').append(select.getElement());

$('.js-btn').on('click', function(e) {
    e.preventDefault();

    var id = $(this).attr('data-id');

    select.changeRegion(id);
});

// Надо убрать дуб
$(select).on('change', function() {
    alert('hello')
});



