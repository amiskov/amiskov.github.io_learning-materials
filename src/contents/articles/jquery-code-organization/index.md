---
title: jQuery Code Organization
author: amiskov
date: 2015-09-23 10:30
template: article.jade
---

Кратко о самых простых способах организации кода.
<span class="more"></span>

# Основные моменты
* Код нужно дробить на модули — небольшие функциональные блоки.
* Не нужно копипастить код. Для этого есть наследование.
* jQuery плотно работает с DOM, однако яваскрипт-модули (приложение) — это не про DOM. Функционал не нужно 
привязывать к DOM.
* Модули должны существовать максимально обособлено (слабое зацепление). Коммуникацию между модулями нужно 
организовывать с помощью событий или pub/sub (!!!).

# Инкапсуляция
Приложение нужно разделять на функциональные блоки — модули. Зачастую этого уже достаточно для грамотной организации 
кода.

## Объявление объекта
Самый простой способ для изоляции кода — использовать объект. Мы не получим приватных методов и свойств, но объект 
позволит нам избежать анонимных функций, выделить конфигурацию (опции), упростить поддержку кода и рефакторинг:

```js
// An object literal
var myFeature = {
    myProperty: "hello",
 
    myMethod: function() {
        console.log( myFeature.myProperty );
    },
 
    init: function( settings ) {
        myFeature.settings = settings;
    },
 
    readSettings: function() {
        console.log( myFeature.settings );
    }
};
 
myFeature.myProperty === "hello"; // true
 
myFeature.myMethod(); // "hello"
 
myFeature.init({
    foo: "bar"
});
 
myFeature.readSettings(); // { foo: "bar" }
```

## Прием проектирования «Модуль»
Позволяет делать приватные методы и открывать доступ только к необходимому функционалу.

Мы уже рассматривали ранее этот прием, почитать можно [тут](http://learn.javascript.ru/closures-module).

## Анонимные функции
Анонимные функции тяжело читаемы, их неудобно поддерживать, тестироватиь, повторно использовать код.

Вместо анонимных функций нужно использовать именованные или организовывать код в виде объектов:

```js
// BAD
$( document ).ready(function() {
    $( "#magic" ).click(function( event ) {
        $( "#yayeffects" ).slideUp(function() {
            // ...
        });
    });
 
    $( "#happiness" ).load( url + " #unicorns", function() {
        // ...
    });
 
});
 
// BETTER
var PI = {
 
    onReady: function() {
        $( "#magic" ).click( PI.candyMtn );
        $( "#happiness" ).load( PI.url + " #unicorns", PI.unicornCb );
    },
 
    candyMtn: function( event ) {
        $( "#yayeffects" ).slideUp( PI.slideCb );
    },
 
    slideCb: function() { ... },
 
    unicornCb: function() { ... }
 
};
 
$( document ).ready( PI.onReady );
```

## Не нужно копипастить (DRY — Don't Repeat Yourself)
Повторение кода очень вредно. Попробуйте что-то изментиь, придется лазить по всему коду:

```js
// BAD
if ( eventfade.data( "currently" ) !== "showing" ) {
    eventfade.stop();
}
 
if ( eventhover.data( "currently" ) !== "showing" ) {
    eventhover.stop();
}
 
if ( spans.data( "currently" ) !== "showing" ) {
    spans.stop();
}
 
// GOOD!!
var elems = [ eventfade, eventhover, spans ];
 
$.each( elems, function( i, elem ) {
    if ( elem.data( "currently" ) !== "showing" ) {
        elem.stop();
    }
});
```

# Смотреть браузер или фичу?
Если нужно использовать какой-то функционал, котоырй не всеми поддерживается, то можно определить браузер или 
определить, пожддерживается ли фича. Второй способ предпочтительнее.

## Минусы определения браузера
* Другие браузеры могут тоже содержать/не содержать нужную нам фичу.
* Со временем фича может добавляться/меняться
* Браузер может подменить строку UA

## Определение фичи без библиотеки
Чтобы определить, работает ли что-то в браузере, мы пробуем, и смотрим, что получилось. Это просто, но долго:

```js
// We want to show a graph in browsers that support canvas,
// but a data table in browsers that don't.
var elem = document.createElement( "canvas" );
 
if ( elem.getContext && elem.getContext( "2d" ) ) {
    showGraph();
} else {
    showTable();
}
```

Предпочтительнее использовать библиотеку Modernizr или аналогичные:

```js
if ( Modernizr.canvas ) {
    showGraphWithCanvas();
} else {
    showTable();
}
```

Ссылки: https://learn.jquery.com/code-organization/feature-browser-detection/#other-resources


