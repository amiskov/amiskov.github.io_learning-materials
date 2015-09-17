(function ($) {
    'use strict';

    $.fn.sortTable = function (options) {
        return this.each(function () {
            var opts = $.extend({}, $.fn.sortTable.defaults, options),
                $table = $(this),
                numberCols = $table.find('th').length,
                orderCol = opts.order,
                arr = [];

            function init() {
                createArr();
                initTable();
                initEvents();
            }

            function createArr() {
                $table.find('tbody tr').each(function () {
                    var $row = $(this),
                        arrRow = [];

                    $row.find('td').each(function () {
                        var $cell = $(this);
                        arrRow.push($cell.text());
                    });

                    arr.push(arrRow);
                });
            }

            function sortRows(index, isNumber, orderCol) {
                arr.sort(function (a, b) {
                    var value1 = a[index],
                        value2 = b[index],
                        order = (orderCol) ? orderCol : opts.order,
                        result;

                    if (value1 === value2) {
                        return;
                    }

                    if (isNumber) {
                        value1 = parseInt(value1, 10);
                        value2 = parseInt(value2, 10);
                    }

                    result = (value1 > value2) ? 1 : -1;

                    if (order === -1) {
                        result = -result;
                    }

                    return result;
                });
            }

            function sort(index, isNumber, $col, orderCol) {
                sortRows(index, isNumber, orderCol);
                rewriteTable();

                $table.find('th').removeClass('sorted');
                $col.addClass('sorted');
            }

            function initTable() {
                $('.js-change-order').attr('data-order', opts.order);

                if (opts.initiallySorted && opts.indexCol >= 0 && opts.indexCol < numberCols) {
                    var $col = $table.find('th').eq(opts.indexCol),
                        isNumber = $col.attr('data-type') === 'number';

                    if (opts.order === -1) {
                        $col.addClass('desc');
                    }

                    sort(opts.indexCol, isNumber, $col);
                }
            }

            function markOrderTable() {
                if (opts.order === -1) {
                    $table.find('th').addClass('desc');
                } else {
                    $table.find('th').removeClass('desc');
                }
            }

            function initEvents() {
                $table.on('click', 'th', function () {
                    var $col = $(this),
                        isNumber = $col.attr('data-type') === 'number';

                    if ($col.hasClass('sorted')) {
                        $col.toggleClass('desc');
                        orderCol = -(orderCol);
                    } else {
                        orderCol = opts.order;
                        markOrderTable();
                    }

                    sort($col.index(), isNumber, $col, orderCol);
                });

                if (opts.changeOrder) {
                    $(opts.btnChange).on('click', function () {
                        opts.order = -(opts.order);
                        $(this).attr('data-order', opts.order);
                        markOrderTable();

                        if ($table.find('th.sorted').length) {
                            var $col = $table.find('th.sorted'),
                                isNumber = $col.attr('data-type') === 'number';

                            orderCol = opts.order;
                            sort($col.index(), isNumber, $col, orderCol);
                        }
                    });
                }
            }

            function rewriteTable() {
                $table.find('tbody tr').each(function (iRow) {
                    $(this).find('td').each(function (iCell) {
                        var $cell = $(this);
                        $cell.text(arr[iRow][iCell]);
                    });
                });
            }

            init();
        });
    };

    $.fn.sortTable.defaults = {
        initiallySorted: false,
        changeOrder: true,
        btnChange: '.js-change-order',
        indexCol: 0,
        order: 1 // 1 or -1
    };

}(jQuery));