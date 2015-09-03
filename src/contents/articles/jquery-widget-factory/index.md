---
title: jQuery Widget Factory
author: amiskov
date: 2015-09-09 10:30
template: article.jade
---

Плагины нужны, чтобы расширить существующий функционал фреймворка. Обычно они запускаются на коллекции, что-то с ней 
делают и возвращают этй же коллекцию.

Если мы имеем дело с более сложными штуками, которые больше похожи на объекты, то плагины могут быть не слишком 
удобны в использовании.

Для того, чтобы создавать более ООП-ориентированные сущности и в то же время быть в среде jQuery создали [jQuery 
Widget Factofy](http://jqueryui.com/widget/), которая является частью jQuery UI и может быть использована отдельно 
(7Кб в сжатом виде). 
<span class="more"></span>

## Написание плагина
В метод `$.widget` передается 2 параметра: имя плагина и объект с его функционалом:

```js
$.widget( "nmk.progressbar", { // nmk — namespace, progressbar - widget name
 
    _create: function() {
        var progress = this.options.value + "%";
        this.element.addClass( "progressbar" ).text( progress );
    }
 
});
```    

## Соглашения
Пространство имен: имя плагина начинается с неймспейса, далее следует точка и после точки идет имя плагина:
`nmk.progressbar`. Неймспейс `ui` занят компонентами библиотеки jQuery UI. Нам следует использовать свое собственное 
пространство имен.

`this.element` — объект jQuery (единичный). Если плагин, созданный через Widget Factory, вызывается на коллекции 
элементов jQuery, то для каждого элемента создается свой собственный экземляр.
 
`this.options` — объект с опциями, которые переданы при инициализации.

Значения по умолчанию (опции и коллбэки) мы можем обозначить как объект `options`:

```js
$.widget( "nmk.progressbar", {
 
    // Default options.
    options: {
        value: 0,
        
        callback: null // Callbacks are also here
    },
 
    _create: function() {
        var progress = this.options.value + "%";
        this.element.addClass( "progressbar" ).text( progress );
    }
 
});
```

## Добавление методов
Мы можем добавить методы в наш объект, в том числе приватные, начав их имена с подчеркивания:

```js
$.widget( "nmk.progressbar", {
    options: {
        value: 0
    },
 
    _create: function() {
        var progress = this.options.value + "%";
        this.element.addClass("progressbar").text( progress );
    },
 
    // Create a public method.
    value: function( value ) {
 
        // No value passed, act as a getter.
        if ( value === undefined ) {
 
            return this.options.value;
 
        // Value passed, act as a setter.
        } else {
 
            this.options.value = this._constrain( value );
            var progress = this.options.value + "%";
            this.element.text( progress );
 
        }
 
    },
 
    // Create a private method.
    _constrain: function( value ) {
 
        if ( value > 100 ) {
            value = 100;
        }
 
        if ( value < 0 ) {
            value = 0;
        }
 
        return value;
    }
 
});
```

Для вызова методов нужно передать параметр в jQuery-плагин. Если нужно установить значение, то передаем его следом:

```js
var bar = $( "<div />" ).appendTo( "body").progressbar({ value: 20 });
 
// Get the current value.
alert( bar.progressbar( "value" ) );
 
// Update the value.
bar.progressbar( "value", 50 );
 
// Get the current value again.
alert( bar.progressbar( "value" ) );
```

Это не самый удобный способ работы. Так сделано для того, чтобы по-минимуму воздействовать своими методами объект `$`.

## Работа с опциями
Widget Factory предоставляет возможность работы с опциями автоматически: ???

````js
$.widget( "nmk.progressbar", {
 
    options: {
        value: 0
    },
 
    _create: function() {
        this.element.addClass( "progressbar" );
        this._update();
    },
 
    _setOption: function( key, value ) {
        this.options[ key ] = value;
        this._update();
    },
 
    _update: function() {
        var progress = this.options.value + "%";
        this.element.text( progress );
    }
 
});
````

## Callbacks
Для запуска коллбэка существует метод `_trigger`:

```js
$.widget( "nmk.progressbar", {
 
    options: {
        value: 0
    },
 
    _create: function() {
        this.element.addClass( "progressbar" );
        this._update();
    },
 
    _setOption: function( key, value ) {
        this.options[ key ] = value;
        this._update();
    },
 
    _update: function() {
        var progress = this.options.value + "%";
        this.element.text( progress );
        if ( this.options.value == 100 ) {
            this._trigger( "complete", null, { value: 100 } );
        }
    }
 
});
```

## Как работает Widget Factory
Когда мы создаем виджет, мы передаем в него неймспейс.имя и объект. WF создаст конструктор и будет использовать 
переданный объект как прототип для него. Весь дефолтный функционал будет браться из `jQuery.Widget.prototype`.


# Итого
Нет четких рецептов, когда что надо использовать. Нужно знать как работает экосистема jQuery, что хорошо и что плохо.
Нужно уметь пользоваться тем, что предоставляе библиотека и сообщество. Однако, стоит понить о том, что прежде всего — сделанная задача. Так, если на проекте нужен 
слайдер, то, возможно, его стоит сделать просто через конструктор. Если элемент точно будет использоваться повторно, 
то стоит подумать о применении плагина.

При создании, экземпляр виджета сохраняется в `.data` DOM-объекта:

```js
var bar = $( "<div />")
    .appendTo( "body" )
    .progressbar()
    .data( "nmk-progressbar" );
 
// Call a method directly on the plugin instance.
bar.option( "value", 50 );
 
// Access properties on the plugin instance.
alert( bar.options.value );
```

Widget Factory позволяет работать с прототипом всех созданных сущностей. Добавляя новые методы, они становятся 
доступны всем эзкемплярам:

```js
$.nmk.progressbar.prototype.reset = function() {
    this._setOption( "value", 0 );
};
```
# Материалы
http://learn.jquery.com/plugins/stateful-plugins-with-widget-factory/
http://api.jqueryui.com/jQuery.widget
