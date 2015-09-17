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

    function initCache() {
        this.$select = $('<div class="select">');
        this.$selectTitle = $('<span class="js-region-selected select__title"/>');
        this.$selectList = $('<ul class="js-region-list select-list"/>');
        this.$container = $('#container');
        this.$btn = $('.js-btn');
    }
    var proxyInitCache = $.proxy( initCache, this);

    function createSelect(obj, selectedId) {
        this.$select.append(this.$selectTitle);
        this.$select.append(this.$selectList);
        this.$select.appendTo(this.$container);

        for (var i in obj) {
            var $selectItem = $('<li class="js-region-item select-list__item"/>');
            $selectItem.attr('data-id', i);
            $selectItem.text(obj[i]);
            $selectItem.appendTo(this.$selectList);
        };

        this.$selectTitle.text(obj[selectedId]);
    }
    var proxyCreateSelect = $.proxy( createSelect, this);

    function openSelectList() {
        this.$selectTitle.on('click', function() {
            this.$selectList.toggleClass('_active');
        }.bind(this));
    }
    var proxyOpenSelectList = $.proxy( openSelectList, this);

    //function chooseRegion() {
    //    var $regionItem = this.$container.find('.js-region-item');
    //
    //    $regionItem.on('click', function(ev) {
    //        var $this = $(ev.currentTarget);
    //        this.$selectTitle.text($this.text());
    //        this.$selectList.toggleClass('_active');
    //    }.bind(this));
    //}
    //var proxyChooseRegion = $.proxy( chooseRegion, this);
    proxyInitCache();
    function chooseRegion(ev) {
        var $this = $(ev.currentTarget);
        this.$selectTitle.text($this.text());
        this.$selectList.toggleClass('_active');
    }

    var $regionItem = this.$container.find('.js-region-item');
    $regionItem.on('click', $.proxy(chooseRegion, this));

    function clickOutside() {
        $(document).on('click', function(e) {
            var target = $(e.target);

            if(!target.hasClass('js-region-selected') && !target.hasClass('js-region-list')) {
                this.$selectList.removeClass('_active');
            }
        }.bind(this));
    }
    var proxyClickOutside = $.proxy( clickOutside, this);

    this.changeRegion = function(id) {
        var $regionItem = this.$container.find('.js-region-item');
        this.$selectTitle.text(obj[id]);
    }

    this.getElement = function() {
        return this.$select;
    }







    proxyCreateSelect(obj, selectedId);
    proxyOpenSelectList();
    //proxyChooseRegion();
    proxyClickOutside();
}

var select = new Select(regions, 485);
$('body').append(select.getElement());
$('.js-btn').on('click', function(e) {
    e.preventDefault();
    var id = $(this).attr('data-id');
    select.changeRegion(id);
});