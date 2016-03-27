Compiling documentation:

compile **TypeScrit**:
```sh
cd frontend
gulp build.js.prod

# or shorter:
cd frontend; gulp build.js.prod
```

build **JSDoc**:
```sh
cd ..
jsdoc -c ../jsdoc/config.js

# or shorter:
cd ..; jsdoc -c ../jsdoc/config.js
```
