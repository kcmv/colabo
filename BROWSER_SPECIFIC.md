# Node editing

## Tracking node name changes

There is an 'old-school' and 'new-school':

[contenteditable change events](http://stackoverflow.com/questions/1391278/contenteditable-change-events)

### New-school

[input event](https://developer.mozilla.org/en-US/docs/Web/Events/input)

```js
document.getElementById("editor").addEventListener("input", function() {
    alert("input event fired");
}, false);
```

#
