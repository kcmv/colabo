# Plugins

KnAllEdge is aiming with to fulfill the following paradigm:

<div style='border: 1px solid gray; padding: 5px; margin: 5%'>

[__<span style='color: #550000'>Kn</span><span style='color: #bb0000'>All</span><span style='color: #8888ff; font-style: italic;'>Edge</span></span>__ system](http://www.knalledge.org) is a general knowledge layer, that can serve as a separate knowledge mapping service, but it also serves as an underlying layer for the  [__<span style='color: gray; font-style: italic;'>Collabo</span><span
 style='color: black'>Science</span>__ ecosystem](http://www.collaboscience.com).

</div>

## Plugins API

Plugin API is provided within the ```collaboPluginsServices module``` that currently has only one service: ```CollaboPluginsService``` that does the whole hard job.

### Registering plugins

It registers plugin with structure

```js
{
    name: "PluginHero",
    components: {

    },
    references: {
        referenceName1: {
            items: {
                itemName1: null,
                itemName2: null,
                ...
            }
        }
    }
}
```

## Plugins page

At the plugins page we can see the list of currently loaded plugins

Path: ```/#/plugins```

Plugins reporter is a component that is existing in: ```components/collaboPlugins```.

in the angular router we have:

```js
.when('/plugins', {
    templateUrl: 'components/collaboPlugins/partials/plugins-index.tpl.html'
})
```
