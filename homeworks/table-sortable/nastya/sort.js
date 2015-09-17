(function($){
    $.fn.sortable = function() {
        var $th = this.find('th'),
            $tr = this.find('tr').not(':eq(0)');

        $th.data('sort', -1);
        addIndex();
        clickProcessing();

        function addIndex() {
            $tr.each(function(index) {
                $(this).attr('data-index', index);
            });
        }

        function clickProcessing() {
            $th.each(function() {
                $(this).on('click', function() {
                    sort($(this));
                });
            });
        }

        function sort($elem) {
            var $array = getElements($elem),
                sortElements = $array.sort(sortRule),
                result = [];

            $th.not($elem).removeClass('sort_asc')
                .removeClass('sort_desc')
                .data('sort', -1);

            if ($elem.data('sort') === -1) {
                $elem.data('sort', 1)
                    .toggleClass('sort_asc');
            } else {
                if ($elem.data('sort')) {
                    sortElements.reverse();
                }
                $elem.data('sort', !$elem.data('sort'))
                    .toggleClass('sort_asc')
                    .toggleClass('sort_desc');
            }

            for (var key in sortElements) {
                result.push($tr.eq(Object.keys(sortElements[key])).html());
            }

            for (var i = 0; i < result.length; i++) {
                $tr.eq(i).html(result[i]);
            }

            return result;
        }

        function sortRule(a, b) {
            var firstValue = a[Object.keys(a)[0]],
                secondValue = b[Object.keys(b)[0]];
            if (firstValue === secondValue) {
                return 0
            }

            return firstValue > secondValue ? 1: -1;
        }

        function getElements($header) {
            var index = $th.index($header),
                result = [];

            $tr.each(function() {
                var value = $header.data('type') === 'number' ? +$(this).find('td').eq(index).text()
                    : $(this).find('td').eq(index).text(),
                    current = {};
                current[$(this).data('index')] = value;
                result.push(current);
            });
            return result;
        }



    };
})(jQuery);

$('.list').sortable();