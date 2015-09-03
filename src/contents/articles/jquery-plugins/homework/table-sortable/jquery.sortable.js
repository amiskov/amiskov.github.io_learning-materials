;
(function ($) {
    $.fn.sortable = function () {
        this.addClass('sortable');
        return this.each(function() {
            $(this).on('click', 'th', sortRows.bind(this));
        });
    };

    function sortRows(event) {
        var $th = $(event.target),
            type = $th.data('type'),
            $tbody = $(this).find('tbody'),
            $rows = $(this).find('tbody tr'),
            index = $th.index();

        $th.addClass('on').siblings().removeClass('on');

        if (type == 'number') {
            var compareItems = function (row1, row2) {
                return row1.cells[index].textContent - row2.cells[index].textContent;
            }
        }
        else if (type == 'string') {
            compareItems = function (row1, row2) {
                return row1.cells[index].textContent > row2.cells[index].textContent;
            }
        }

        var values = [];
        $rows.each(function(idx, el) {
            values.push(el);
        });

        values.sort(compareItems);

        for (i = 0; i < values.length; i++) {
            $tbody.append(values[i]);
        }
    }
})(jQuery);