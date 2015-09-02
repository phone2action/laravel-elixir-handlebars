# laravel-elixir-handlebars
Laravel Elixir Handlebars extension. 

It provides a simple way to pre-compile your Handlebars templates without the need to modify default Blade's delimiters `{{ }}`. It performs faster than using client compilation and plays nice with existing Laravel views.

### Install
`$ npm install laravel-elixir-handlebars --save-dev`

### Usage
```javascript
var elixir = require('laravel-elixir');
 
require('laravel-elixir-handlebars');
 
elixir(function (mix) {
 
    // Handlebar templates 
    mix.templates([
        // Will search in 'resources/views/templates' 
        // and compile to 'resources/js/templates.js'
        'templates/**/*.hbs' 
    ]);
});
```

### Including it in your project
```javascript
//Just join your scripts as usual
mix.scripts([
    'jquery/dist/jquery.js',
    'bootstrap/dist/js/bootstrap.js',
    // ...
    // ... other scripts ...
    // ...
    'handlebars/handlebars.runtime.js' // <- don't forget to add me
    'templates.js', // <- put me right before your main script
    'my_script.js' // <- Now I can use templates! Yay!
], 'public/js/scripts.js');

//And version it if you like
mix.version(['js/scripts.js']);
```

Now you can just use the templates in your js files normally:

`Handlebars.templates.my_template(foo, bar);`
