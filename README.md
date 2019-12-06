# Widget SwitchExtent for ArcGIS API for JavaScript

This is a widget for ArcGIS API for Javascript 4. It allows you go back to your previous extent during your map navigation. It works **only for 2D map** for the moment.

![](switchextent.gif)

This widget exists for the ArcGIS API for JavaScript 3.x : https://developers.arcgis.com/javascript/3/jsapi/navigation-amd.html

## Installation

### Clone

- Clone this repo to your local machine using `https://github.com/qQsss777/arcgis-js4-widget-savesession.git`

### Setup

It requires the installation of:
- TypeScript : https://www.typescriptlang.org/index.html#download-links
- gulp-cli : https://gulpjs.com/

You need the ArcGIS API for JavaScript Typings too : https://developers.arcgis.com/javascript/latest/guide/typescript-setup/index.html#install-the-arcgis-api-for-javascript-typings

>  install npm packages @types/arcgis-js-api

```shell
$ npm install -g typescript
$ npm install -g gulp-cli
$ npm install
```

To test it, you can follow this guide to use it : https://developers.arcgis.com/javascript/latest/sample-code/widgets-custom-recenter/index.html#4 (paragraph Reference and use the custom widget )


Then you can build the widget with running the command :

```shell
$ gulp
```
You need to import first the widget in your html file.

```javascript
<script type="text/javascript">
    var dojoConfig = {
        paths: { dist: location.pathname.replace(/\/[^/]+$/, "") + "/dist" }
    };
</script>
<script src="https://js.arcgis.com/4.13/"></script>
```

Then you can use it in your js files. Don't forget the css !

---

## Configuration

```javascript

const map = new Map({
    basemap: "satellite"
});


var view = new MapView({
    map: map,
    container: "app",
    zoom: 11,
    center: [-4.5696403, 48.4083868]
});

const myWidget = new SwitchExtent({
    view: view, 
    count: 10 //number of extent in memory
});
view.ui.add(myWidget, "top-right")

```

---

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**

