---
title: Webpack
author: amiskov
date: 2015-10-14 10:30
template: article.jade
---

Вебпак — это сборщик модулей. Он позволяет организовать зависимости между модулями, асинхронную подгрузку и другие полезные штуки. По этому материалу есть [домашнее задание](./#-homework-).
<span class="more"></span>

# Система модулей
Для Вебпака любой ресурс — это модуль. JS, CSS, картинка, шрифт и пр. По умолчанию Вебпак обрабатывает js-модули, для других ресурсов нужно использовать лоадеры:

```js
// файл simple-product.js
var $ = require('jquery'); // пакет из node_modules
var Product = require('./product'); // наш файл

var myProduct = new Product();
```

## Лоадеры
Вебпак позволяет работать с картинками, CSS, шрифтами  и другими ресурсами как с модулями (реквайрить, сохранять в переменные).

Если просто написать `require('./some.css')`, то при сборке будет ошибка. Вебпак из коробки понимает только js-модули. Для того, чтобы заработал, например, css-модуль, надо пропустить его через соответствующий лоадер.

`css-loader` сделает возможной подгрузку CSS-модуля (вернет содержимое в виде  js-структуры). Его можно будет зареквайрить, сохранить в переменную, но стиль не применится.

Чтобы стиль применился, нужно использовать `style-loader`, который уже встроит стиль в страницу.

Получаем:

```js
require('style!css!./some.css'); // Стили подгрузятся и применятся на странице
```

Восклицательный знак отделяет лоадеры друг-от-друга и применяется справа-налево.

Любые подключения шрифтов и картинок в CSS-файлах Вебпак рассматривает как подключение модулей и заменяет их на `require('...')`, поэтому без соответствующих лоадеров не обойтись.

`file-loader` переносит ресурс в папку со сборкой, `url-loader` делает так же, но, если размер ресурса (картинки) достаточно мал, может запаковать его в base-64 и встроить в CSS.
 
Не нужно каждый раз писать руками `style!css!less`, эту настройку лучше задать в конфиге.

```js
module.exports = {
  // ...
  module: {
    loaders: [
        {
            // LESS
            test: /\.less$/,
            exclude: /all.less$/,
            loader: 'style!css!autoprefixer!less'
        },

        {
            // Картинки
            test: /\.(jp?g|gif|png|svg)$/,
            exclude: /node_modules/,
            loader: 'url-loader?limit=1024&name=[path][name].[ext]?[hash]'
            // Картинки <= 1024 байта закодируются в base64
        }
    ]
  }
  // ...
}
```

[Конфигурация лоадеров](http://webpack.github.io/docs/configuration.html#module-loaders) в документации Вебпака.

[Список лоадеров](https://webpack.github.io/docs/list-of-loaders.html) для Вебпака на официальном сате.

## PreLoaders
Иногда Вебпаку нужно обработать код до того, как его собирать. Например, проверить JS с помощью линтера. Для этих целей предусмотрен механизм прелоадеров. Они запускаются перед лоадерами.

Пример подключения [ESLint](https://github.com/MoOx/eslint-loader):

```js
module.exports = {
  // ...
  module: {
    preLoaders: [
      {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
    ]
  }
  // ...
}
```

## Асинхронная подгрузка модулей (`require.ensure`)
Вебпак дополняет синтаксис CommonJS для работы с модулями своим методом `.ensure`. Этот метод позволяет организовать асинхронную подгрузку:

```js
require.ensure(['./lib'], function(require) { // Аргумент — функция require
  var lib = require('./lib'); // Загрузится отдельным запросом
});
```

Можно и без явного указания массива модулей и аргумента:

```js
require.ensure([], function() { 
  var lib = require('./lib'); // Вебпак так тоже разберется
});
```

Удобно использовать для библиотек или плагинов, которые могут быть нужны не сразу. Например, для слайдера с большими картинками можно асинхронно подключить нужный модуль с jquery-плагином, стилями и картинками, а потом после загрузки уже его инициализировать.

Если нужно объединить несколько подключений `require.ensure` в один файл (схожий функционал), то третьим параметром можно передать название такого функционала. Все `require.ensure` с таким именем объединятся в один файл:

```js
// login.js
$logoutButton.click = function() {
    require.ensure([], function() {
        var login = require('./login');
        // ...
    }, 'auth');
};

// logout.js
$logoutButton.click = function() {
    require.ensure([], function() {
        var login = require('./logout');
        // ...
    }, 'auth');
};
```

Вебпак создаст файл `auth.js` и будет его подгружать динамечески, когда понадобиться.

# Подключение jQuery и других библиотек с глобальными переменными
Самый простой способ подключить такую библиотеку — просто отдельный тег `<script>`. Но с Вебпаком можно сделать более интересные вещи.

## externals
Если библиотека уже подключена, например, с CDN, а модули ее реквайрят, то будет ошибка. При подключении в файле `require('jquery')` Вебпак будет искать ее код в проекте, но не найдет. Чтобы сказать сборщику, что библиотека уже подключена, используется свойство `externals`:

```js
// webpack.config.js
module.exports = {
    // ...
    externals: {
        'jquery': 'jQuery'
    }
};
```

См. так же [документацию](https://webpack.github.io/docs/library-and-externals.html) и [скринкаст](https://youtu.be/RdZkFNzST3c).

## ProvidePlugin
Можно использовать `ProvidePlugin`, который автоматически будет подключать модуль, если найдет переменную. Например, вот эта настройка говорит, что нужно сделать `require('jquery')`, если найдется в файле `$`, `jQuery` или `window.jQuery`:

```js
plugins: [ 
  new webpack.ProvidePlugin({ 
      $: ‘jquery’, 
      jQuery: ‘jquery’, 
      ‘window.jQuery’: ‘jquery’
    })
]
```

## externals
Если библиотека jQuery уже подключена отдельно (например, через CDN), а мы хотим делать `require('jquery')`, то можно об этом сказать Вбпаку с помощью `externals`:

```js
externals: {
    jquery: 'jQuery',
    $: 'jQuery'
}
```

и дальше уже можно делать `require('jquery')`.

Подробнее: https://webpack.github.io/docs/library-and-externals.html

## expose-loader
Позволяет указать при подключении, какие переменные открыть глобально:

```js
require('expose?$!expose?jQuery!jquery');
```

## script-loader
`script-loader` сэмулирует поключение библиотеки отдельных тегом `<script src="path/to/jquery.js"></script>`, но при этом библиотека будет включена в сборочный файл и мы сэкономим один запрос:

```js
// index.js
require('script!jquery'); // Взять jquery из node_modules и пропустить через script-loader
```

`jQuery` и `$` будут доступны в глобальной области видимости, как если бы библиотеку подключили отдельно.

*Ахтунг!* При использовании `script-loader` код вставляется в страницу как есть. Оне будет минифицирован при сборке и сорс-мапы для него не сгенерируются. По возможности стоит избегать.

# Config Files
Конфигурационный файл Вебпака — это CommonJS-модуль, который возвращает объект.

Пример:

```js
module.exports = {
    entry: ["./utils.js", "./app.js"], // сольются в бандле
    output: {
        filename: "bundle.js"
    },
    {   // Обработка картинок
        test: /\.(jp?g|gif|png)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=1024&name=[path][name].[hash].[ext]'
        // [hash] — автоматически генерируемый код. 
        // Нужен для лучшего кеширования.
    }
}
```

Теперь в терминале можно просто сказать `webpack` и все настройки возьмутся из конфига.

Конфиг можно реквайрить в другие конфиги. Например, в конфиг для продакшена можно зареквайрить конфиг для дева и расширить его.

# Command Line Interface (CLI)
Установка Вебпака на уровне системы (чтобы запускать из любого места на диске):

    npm install webpack -g

Пример использования: `webpack ./app.js bundle.js`. Вебпак подключит все зависимости из `app.js`, сделает с ними так, как прописано в конфиге и сохранит результат в `bundle.js`.

`--display-modules` — показать все собираемые модули.

`--profile` — показать время, затраченное на сборку каждого модуля.

`--display-reasons` — показать подключаемые зависимости

## Статистика
`webpack --json --profile > stats.json` — вывести статистику в json-файл с учетом временных параметров.

Проанализировать статистику можно тут: http://webpack.github.io/analyse/



# Watch mode
Включить режим пересборки при изменении файлов можно в командной строке: `webpack --watch` или в файле конфига инструкцией `watch: true`.

# Webpack Dev Server
В Вебпак встроен веб-сервер для удобства разработки. Туда же включен и ливрелоад.
 
Сервер нужно установить отдельно: `npm install webpack-dev-server -g`. После установки мы можем его запускать: `webpack-dev-server`.

Вебпак-сервер предложит смотреть страницу по адресу `http://localhost:8080/webpack-dev-server/`. Там будет панелька 
сверху, а разрабатываемый сайт будет исполняться во фрейме.

Если запустить просто `http://localhost:8080/`, лишней панельки не будет, но сервер будет работать без ливрелоада.

Чтобы видеть сайт без панельки и пользоваться при этом ливрелоадом, нужно запустить веб-сервер с флагом `inline`: `webpack-dev-server --inline`. 

# Скрипты запуска
Для сокращенного синтаксиса запуска Вебпака с параметрами можно использовать NPM. В `package.json` есть свойство `"scripts": {}`.

Исполнить их можно командой `npm run scriptname`. Пример:

```json
...
"scripts": {
    "server": "webpack-dev-server --hot --inline --devtool eval --progress --colors",
    "dev":    "env DEV=true server",
    "prod":   "webpack -p --config webpack.config.production.js"
},
...
```

Сборка для продакшена: `npm run prod`. Вебпак возьмет настройки из файла `webpack.production.js`.

Флаг `-p` (он же `--optimize-minimize`) включает минификацию и обфускацию кода (работает из коробки).

Запустить дев-сервер: `npm run server`. Установится переменная окружения `DEV=true` и запустится сервер с полезными 
при работе параметрами.

Подробнее: http://jaketrent.com/post/list-npm-scripts/

# Переменные окружения
Так работает на Винде и на Юниксе: `npm run env NODE_ENV=production`.

Так только на Юниксе: `npm run NODE_ENV=production`

Так только на Винде: `npm run set NODE_ENV=production`

Так переменная сохранится в настройках терминала: `export NODE_ENV=production`

Мы можем использовать переменные окружения в коде, чтобы сделать процесс разработки удобнее и гибче. Чтобы переменная окружения была доступна в коде, используется `DefinePlugin`, который доступен из объекта `webpack`:

```js
// webpack.config.js
var NODE_ENV = process.env.NODE_ENV || 'development'; // 'development' по умолчанию
var webpack = require('webpack');

module.exports = {
    // ...
    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        })
    ]
};
```

Теперь, запуская `NODE_ENV=production webpack` мы будем иметь соответствующую переменную в нашем коде и сможем добавлять/удалять функционал:

```js
// someModule.js
if (NODE_ENV != 'production') {
    console.log('Some dev info');
}
```

Подробнее: https://docs.npmjs.com/cli/run-script

# Плагины
Модифицировать процесс сборки можно с помощью плагинов. Есть плагины, которые генерируют html-файлы, объявляют глобальные переменные, выносят код в отдельные файлы, оптимизируют модули и пр. См. [список плагинов](https://webpack.github.io/docs/list-of-plugins.html) на сайте Вебпака.

Например, у нас есть модуль `simpleProduct.js`:

```js
require('./simple_product.less');

var Product = require('./product.js');
var simpleProduct = new Product();
```

Здесь первой строкой подулючаются стили. Вебпак приготовит свой js-бандл при сборке и добавит их прямо в js-файл. 

Если нам нужно эти стили вынести в файл и подключить отедльно, можно использовать `ExtractTextPlugin`:

```js
// webpack.config.js
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // ...
    module: {
        loaders: [
            {
                test: /simple_product.less$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!less')
            }
            // ...
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ]
};
```

С помощью плагинов можно сильно изменить процесс сборки.

[Подробнее](https://webpack.github.io/docs/stylesheets.html#separate-css-bundle) про вынос стилей в отдельынй файл.

О плагинах: http://webpack.github.io/docs/plugins.html

# Source maps
Сорсмапы встроены в Вебпак. Включить их можно параметром: `webpack -d`.

# Несколько точек входа (multiple bundles)
Для сайтов, которые состоят более чем из одной страницы, хорошим тоном будет раскидать функциональность по отдельным файлам. Например, на Хомпейдже нам не нужен скрипт для валидации формы изменения пароля для залогиненого пользователя:

```js
module.exports = {
    entry: {
        home: './src/home.js',
        account: './src/account.js',
        checkout: './src/checkout.js',
        styles: './src/less/all.less' // стили тоже могут быть точкой входа
        // ...
    },
    output: {
        filename: [name].js // назвать файлы как и точки входа
        path: __dirname + '/dist', // и положить в директорию /dist
    }
};
```

Зависимость от точки входа запрещена. Реквайрить `account.js` из `home.js` не выйдет. Надо, чтобы `account.js` в этом случае был не точкой входа, а модулем.

Точкой входа могут быть не только js-файлы. Например, стили можно так же подключить в `entry`. В этом случает сгенерируется файл стилей и соответствующий ему файл js, так работает Вебпак.

## Выделение общего кода (CommonsChunkPlugin)
Вебпак позволяет выделить общий код из всех точек входа с помощью `CommonsChunkPlugin`.


# Материалы
* [Скринкаст Webpack](https://learn.javascript.ru/webpack-screencast) от Ильи Кантора. Обязательно к просмотру.
* [Getting Started with webpack](https://www.youtube.com/watch?v=TaWKUpahFZM)
* http://dontkry.com/posts/code/single-page-modules-with-webpack.html
* [Webpack Howto](https://github.com/petehunt/webpack-howto) от Пита Ханта из Инстаграмма + [доклад](http://youtu.be/VkTCL6Nqm6Y)
* [Why can't anyone write a simple webpack tutorial](https://medium.com/@dtothefp/why-can-t-anyone-write-a-simple-webpack-tutorial-d0b075db35ed)

# Домашняя работа [](#homework)
На странице есть слайдер с довольно большими картинками. Слайдер реализован с помощью jQuery-плагина ([Slick](http://kenwheeler.github.io/slick/)). Нам нужно, чтобы все, что касается слайдера (стили, картинки, скрипты) грузилось асинхронно и не влияло на загрузку основного контента.

См. [пример](http://amiskov.github.io/examples/webpack-slider/) реализации. Картинки довольно большие, может долго грузиться. 

Скелет проекта есть на [Гитхабе](https://github.com/amiskov/webpack-slider). Вы просто запускаете `npm install`, скачиваются необходимые модули, в том числе jQuery и Slick. Остается только закодить слайдер в `src/slider.js`.

