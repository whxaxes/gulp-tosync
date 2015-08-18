# gulp-tosync

> A simple gulp plugin which is using to run the tasks of gulp.task method in sync way

## Install
```
$ npm install gulp-tosync --save
```

## Usage

Import the plugin after installed:
```
var gulptosync = require("gulp-tosync")
```

### demo_1:
```
gulp.task("default", gulptosync(["build-css", "build-js", "build-img"], "build-html"));
```
#### results:
```
E:\GitHub\myblog>gulp
[17:44:55] Using gulpfile E:\GitHub\myblog\gulpfile.js
[17:44:55] Starting 'default'...
[17:44:55] Starting 'build-css'...
[17:44:55] Starting 'build-img'...
[17:44:55] Starting 'build-js'...
[17:44:55] Finished 'build-img' after 23 ms
[17:44:56] Finished 'build-css' after 615 ms
[17:44:56] Finished 'build-js' after 703 ms
[17:44:56] Starting 'build-html'...
[17:44:56] Finished 'build-html' after 48 ms
[17:44:56] Finished 'default' after 850 ms
```

### demo_2:
```
gulp.task("test", gulptosync(["build-js", "build-img"]));
gulp.task("default", gulptosync(["build-css", "test"], "build-html"));
```

#### results:
```
E:\GitHub\myblog>gulp
[17:47:45] Using gulpfile E:\GitHub\myblog\gulpfile.js
[17:47:45] Starting 'default'...
[17:47:45] Starting 'build-css'...
[17:47:45] Starting 'build-img'...
[17:47:45] Starting 'test'...
[17:47:45] Starting 'build-js'...
[17:47:45] Finished 'build-img' after 24 ms
[17:47:45] Finished 'build-css' after 627 ms
[17:47:45] Finished 'build-js' after 713 ms
[17:47:45] Finished 'test' after 727 ms
[17:47:45] Starting 'build-html'...
[17:47:45] Finished 'build-html' after 46 ms
[17:47:45] Finished 'default' after 839 ms
```

## Lisence

MIT
