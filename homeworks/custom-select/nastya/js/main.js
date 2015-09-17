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
    var rememberSelectedId,
        toggleDropdown,
        changeDropdownProcessing,
        clickDropdownProcessing,
        updateDropdownProcessing,
        destroyDropdownProcessing,
        addEvents;

    this.$list = $('<div />', {class: 'dropdown'})
        .append($('<p />', {class: 'dropdown__value'}))
        .append($('<ul />', {class: 'dropdown__list'}));

    this.getElement = function() {
        for (var i in regions) {
            var checkSelectedItem = (parseInt(i, 10) === selectedId) ? '_active' : '',
                $listItem = $('<li />')
                                .attr('data-id', i)
                                .text(regions[i])
                                .addClass(checkSelectedItem);
            this.$list.find('ul').append($listItem);
            rememberSelectedId(selectedId);
        }
        return this.$list;
    };

    this.getValue = function() {
        return this.$list.data('value');
    };

    this.setValue = function(value) {
        this.$list.find('._active').removeClass('_active');
        this.$list.find('li').filter('[data-id=' + value + ']').addClass('_active');
        rememberSelectedId(value);
        $(this).trigger('change');
    };

    toggleDropdown = function() {
        $('body').on('click', function(event) {
            var $elem = $(event.target);
            if (!$elem.hasClass('dropdown') && !$elem.closest('.dropdown').length) {
                this.$list.removeClass('_open');
            } else {
                this.$list.toggleClass('_open');
            }
        }.bind(this));
    }.bind(this);

    rememberSelectedId = function(value) {
        this.$list.data('value', value);
        this.$list.find('.dropdown__value').html(regions[value]);
        this.$list.find('.dropdown__list').prepend(this.$list.find('._active'));
    }.bind(this);

    changeDropdownProcessing = function(event) {
        event.value = this.getValue();
    }.bind(this);

    clickDropdownProcessing = function() {
        this.$list.find('ul').on('click', function(event) {
            var $listItem = $(event.target);
            this.$list.find('._active').removeClass('_active');
            $listItem.addClass('_active');
            if ($listItem.data('id') !== this.getValue()) {
                rememberSelectedId($listItem.data('id'));
                $(this).trigger('change');
            }
        }.bind(this));
    }.bind(this);

    updateDropdownProcessing = function() {
        $(this).trigger('destroy');
        this.getElement();
    }.bind(this);

    destroyDropdownProcessing = function() {
        this.$list.empty();
    }.bind(this);

    addEvents = function() {
        $(this).on('change', function(event) {
            changeDropdownProcessing(event);
        });

        $(this).on('update', function(event) {
            updateDropdownProcessing(event);
        });

        $(this).on('destroy', function(event) {
            destroyDropdownProcessing(event);
        });

    }.bind(this);

    toggleDropdown();
    clickDropdownProcessing();
    addEvents();
}

var select = new Select(regions, 486);
$(select).on('change', function(e) {
    console.log('Current dropdown value:', e.value);
});
$('#regions').append(select.getElement());
$('#dropdownSetValue').on('click', function() {
    select.setValue($(this).data('id'));
});
