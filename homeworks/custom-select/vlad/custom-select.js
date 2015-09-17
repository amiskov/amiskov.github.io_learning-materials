


function Select($el, currentItemId) {

    'use strict';

    var select = {
        containerId: 'selectContainer',
        containerClass: 'select',
        listClass: 'select__list',
        itemClass: 'select__item',

        init: function() {
            this.createList();
            this.selectItem();
            this.showList();
        },

        showList: function() {
            $('body').on('click', '.select__input', function() {
                $(this)
                    .closest('#' + select.containerId)
                    .find('.' + select.listClass)
                    .toggleClass('open')
                    .end()
                    .find('.select__input')
                    .toggleClass('open');
            });
        },

        createSelect: function() {
            var $selectContainer = $('<div></div>', {
                id: select.containerId,
                'class': select.containerClass
            }).append(select.createControls)
                .append(select.createList);

            return $selectContainer;
        },

        createList: function() {
            var $ul = $('<ul></ul>', {
                    'class': select.listClass
                }),
                index = 0,
                id = 0,
                status = false,
                $li;

            $.each($el, function(key, value) {
                if (++index === currentItemId) {
                    status = true;
                    select.itemClass += ' default';
                } else {
                    status = false;
                    select.itemClass = 'select__item';
                }

                $li = $('<li></li>', {
                    'class': select.itemClass,
                    'data-region-id': key,
                    'data-id': ++id,
                    'data-selected': status,
                    'text': value
                });

                $ul.append($li);

            });

            return $ul;
        },

        createControls: function() {
            var selectedItem = $el[0],
                $selectControls = $('<div></div>', {
                    'class': 'select__controls'
                }).append(select.setDefaultItem()),
                $selectInput = $('<div></div>', {
                    'class': 'select__input',
                    'text': selectedItem,
                }).appendTo($selectControls);

            return $selectControls;
        },

        selectItem: function() {
            $('body').on('click', '.select__item', function() {

                var $self = $(this),
                    input = $self.closest('#' + select.containerId).find('.select__input'),
                    regionId = $self.data('region-id'),
                    value = $self.html();

                $self
                    .parent()
                    .removeClass('open')
                    .find('.' + select.itemClass)
                    .removeClass('selected')
                    .closest('#' + select.containerId)
                    .find('.select__input')
                    .removeClass('open');

                input.empty().append($self.addClass('selected').text());

                $('#regions').trigger({
                    type: "change",
                    value: value,
                    regionId: regionId
                });

            });
        },

        setDefaultItem: function(currentItemId) {
            var $button = $('<a></a>', {
                'class': 'select__default'
            });

            $('body').on('click', '.select__default', function() {
                var $self = $(this),
                    $container = $self.closest('#' + select.containerId),
                    $input = $container.find('.select__input'),
                    $selectedItem = $container.find('.select__item').filter('.default');

                $self
                    .closest('.select')
                    .find('.' + select.itemClass)
                    .removeClass('selected')
                    .end()
                    .find($button)
                    .text($selectedItem.text());

                $input.empty().append($selectedItem.addClass('selected').text());
            });

            return $button;
        }

    };

    $(document).ready(function() {
        select.init();
        $(this).find('.select__default').trigger('click');
    });

    this.getElement = function() {
        return select.createSelect();
    };

}

{

}