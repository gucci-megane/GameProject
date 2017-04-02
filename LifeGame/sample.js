var SCREEN_SIZE = 500;
var SCREEN_SIZE = 500; // キャンバスの幅
var SIDE_CELLS = 200; // 一辺のセルの数
var CELL_SIZE = SCREEN_SIZE / SIDE_CELLS;
var FPS = 10;
var canvas;
var context;
var generations;
var clickCount;
var timerID;
var suspend_field;
var suspend_tmpField;

window.onload = function() {
  var field = new Array(SIDE_CELLS*SIDE_CELLS);
  var tempField = new Array(SIDE_CELLS*SIDE_CELLS);
  for (var i=0; i<field.length; i++) field[i] = Math.floor(Math.random()*2);
  canvas = document.getElementById('world');
  canvas.width = canvas.height = SCREEN_SIZE;
  var scaleRate = Math.min(window.innerWidth/SCREEN_SIZE, window.innerHeight/SCREEN_SIZE);
  canvas.style.width = canvas.style.height = SCREEN_SIZE*scaleRate+'px';
  canvas.addEventListener('click', formClick, false);
  context = canvas.getContext('2d');
  context.fillStyle = 'rgb(91,162,117)';
  document.getElementById("text").style.color = 'rgb(211, 85, 149)';
  generations=0;
  update(field, tempField);
  clickCount=0;
}

function update(field, tempField) {
    var n = 0;
    generations++;
    text = document.getElementById('text');
    text.innerHTML = "第"+ generations+"世代";
    tempField = field.slice();
    for (var i=0; i<tempField.length; i++) {
        n = 0;
        for (var s=-1; s<2; s++) {
            for (var t=-1; t<2; t++) {
                if (s==0 && t==0) continue;
                var c = i+s*SIDE_CELLS+t;
                if (c>=0 && c<tempField.length) {
                    if (i<c && c%SIDE_CELLS!=0 || i>c && c%SIDE_CELLS!=SIDE_CELLS-1) {
                        if (tempField[c]) n ++;
                    }
                }
            }
        }
        if (tempField[i] && (n==2||n==3)) {
            field[i] = 1;
        } else if (!tempField[i] && n==3) {
            field[i] = 1;
        } else field[i] = 0;
    }
    draw(field);
    suspend_field = field;
    suspend_tmpField = tempField;
    timerID = setTimeout(update, 1000/FPS, field, tempField);
}

function draw(field) {
    context.clearRect(0, 0, SCREEN_SIZE, SCREEN_SIZE);
    for (var i=0; i<field.length; i++) {
        var x = (i%SIDE_CELLS) * CELL_SIZE;
        var y = Math.floor(i/SIDE_CELLS) * CELL_SIZE;
        if (field[i]) context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    }
}

function formClick() {
  clickCount++;
  if(clickCount==1){
    clearTimeout(timerID)
  }
  else{
    clickCount=0;
    update(suspend_field,suspend_tmpField);
  }

}
