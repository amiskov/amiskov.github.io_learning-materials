// 'use strict'
function Select(list, $element, selectedId) {
    init = function () {
        console.log(this);
        this.create();
        this.initEvents();
    }

    create = function () {
        var _this = this, // Зачем он тут? Это все window
            $content = $('<ul class="custom-select-list"></ul>'),
            $item = null;

        console.log(this, _this);

        $element
            .wrap('<div class="custom-select"></div>')
            .addClass('custom-select-title')
            .after($content);

        for (item in list) {
            $item = '<li data-value="' + item + '">' + list[item] + '</li>';
            $content.append($item);
        }


        _this.setDefault($content);
    }

    setDefault = function ($content) {
        if (selectedId) {
            var $selected = $content.find('li[data-value="' + selectedId + '"]');
            if ($selected && $selected.length) {
                $element.text($selected.text());
            }
        }
    }

    changeValue = function ($this) {
        $element.text($this.text());
    }

    initEvents = function () {
        var _this = this,
            $parent = $element.parent();

        function closeSelect() {
            $parent.removeClass('opened');
        }

        $element.on('click', function () {
            $parent.toggleClass('opened');
        });

        $element.on('change', function (ev, $this) {
            ev.value = $this.attr('data-value');
            _this.changeValue($this);
            closeSelect();
        });

        $parent.on('click', 'li', function () {
            $element.triggerHandler('change', [$(this)]);
        });

        $('body').on('click', function (e) {
            var target = $(e.target);

            if (target.parents('.custom-select').length && $('.custom-select-list:visible') ||
                target.hasClass('custom-select')) {
                e.stopPropagation();
            } else {
                closeSelect();
            }
        });
    }

    init();

    this.getElement = function () {
        return $element;
    };

    this.setValue = function (value) {
        changeValue($element.parent().find('li[data-value="' + value + '"]'));
    };
}