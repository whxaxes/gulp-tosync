var gulp = require("gulp");
var gulptosync = require("../");

gulp.task("move1", function(){
    gulp.src("./src/file1.js").pipe(gulp.dest("./dest"))
});

gulp.task("move2", function(){
    gulp.src("./src/file2.js").pipe(gulp.dest("./dest"))
});

gulp.task("move3", function(){
    gulp.src("./src/file3.js").pipe(gulp.dest("./dest"))
});

gulp.task("move4", function(){
    gulp.src("./src/file4.js").pipe(gulp.dest("./dest"))
});

gulp.task("test1", gulptosync(["move1", "move2"], "move3", "move4"));

gulp.task("test2", gulptosync("move1", "move2"));

gulp.task("test3", gulptosync(["move3", "test2"], "move4"));