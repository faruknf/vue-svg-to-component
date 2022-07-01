## **Convert Svg Files to the Vue Components**

### Convert svg files to the Vue components and manipulate the svg's properties such as fill, width, etc. using the props

```bash
#Input                 #Output

svgs                   src/components/svgs
|home.svg              |HomeSvg.vue
|logo.svg              |LogoSvg.vue
|social                |social
    |-instagram.svg         |-InstagramSvg.vue
    |-twitter.svg           |-TwitterSvg.vue
    |dark                   |dark
       |-instagram.svg        |-InstagramSvg.vue
```

### Usage

```bash
npm -D install vue-svg-to-component
```

You can create a command in your package.json

```bash
"scripts": {
  "svg": "vue-svg-to-component <your-svg-folder-path>"
},

# npm run svg
```

or launch the following command if you installed it globally.

```bash
vue-svg-to-component <your-svg-folder-path>
```

Then you can use the component after you imported it.

```js
<TwitterSvg width="40px" fill="black" stroke="white" opacity="0.4" />
```

### Only Size (--only-size)

It is used to preserve the original color property(fill,stroke) values for an SVG, which has multiple color properties. If you use this flag, the color props have limited effect on the SVG so it makes sense not to use it if you want to solid color(one color) SVG.

```bash
"scripts": {
  "svg": "vue-svg-to-component --only-size ./src/assets"
},

# npm run svg
```

### Props

The default values of the following props are their original values, but if the SVG does not have the following properties, the following values will be the default of the SVG props.

\*\* Type of the all props is string

| props       | default |
| ----------- | ------- |
| width       | 24      |
| height      | auto    |
| fill        | none    |
| stroke      | none    |
| strokeWidth | 1       |
| opacity     | 1       |

### License

MIT
