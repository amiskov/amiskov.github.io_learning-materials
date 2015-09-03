$(function() {
    $('.homework-tip').on('click', '.homework-tip__handle', function () {
        $(this).parent().toggleClass('open');
    });
});