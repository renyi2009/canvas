let canvas = document.getElementById("canvas");
// 让 canvas 的宽高和屏幕一样大
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let ctx = canvas.getContext('2d');
ctx.lineCap = "round"; // 笔变成圆的，让笔画不断连

let lineSize = 7//笔粗大小
let painting = true; //绘画中是否
let eraserEnable = false //橡皮擦使用否
// 画笔颜色
let nowColor = pen.style.color


//画线。x1画线开始的x坐标, y1画线开始的y坐标, x2画线结束的x坐标, y2画线结束的y坐标
function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = lineSize;
  ctx.stroke();
}

// 设置擦除线
function clearLine(x, y, z) {
  ctx.clearRect(x - z * 1.2, y - z * 1.2, z * 4, z * 4)
}

// 封装使用 选择器
function active(dom, action, doms) {
  for (let i = 0; i < dom.length; i++) {
    dom[i].classList.remove(action);
  }
  doms.classList.add(action)
}


// 切换功能
pen.onclick = () => {
  eraserEnable = false;
  console.log('now', nowColor);
  pen.classList.add('active')
  eraser.classList.remove('active')
}

// 进来就调用 pen 方法
pen.onclick()

// 使用橡皮擦
eraser.onclick = () => {
  eraserEnable = true;
  painting = false;
  eraser.classList.add('active')
  pen.classList.remove('active')
}
//  清屏
clear.onclick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}
// 保存图画
save.onclick = () => {
  const url = canvas.toDataURL('img/png')
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = 'my picture'
  a.target = '_blank'
  a.click()
}

// 切换画笔颜色
const colorLi = colors.getElementsByTagName('li')

function changeColor(color) {
  nowColor = color
  const Oli = document.getElementById(color)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  pen.style.color = color

  active(colorLi, 'active', Oli)
  pen.onclick()
}

black.onclick = function () {
  changeColor('black')
}
red.onclick = function () {
  changeColor('red')
}
yellow.onclick = function () {
  changeColor('yellow')
}
blue.onclick = function () {
  changeColor('blue')
}

// 切换笔的粗细
const penLi = sizes.getElementsByTagName('li')

function changeSize(size) {
  const penSize = document.getElementById(size)
  active(penLi, 'active', penSize)
}

thin.onclick = function () {
  changeSize('thin')
  lineSize = 5
}
normal.onclick = function () {
  changeSize('normal')
  lineSize = 7
}
thick.onclick = function () {
  changeSize('thick')
  lineSize = 12
}


// 判断是触屏设备还是PC端
let isTouchDevice = 'ontouchstart' in document.documentElement;
console.log(isTouchDevice ? '手机端' : 'PC')


let lastPoint = {
  x: undefined,
  y: undefined
}
let down = false
if (isTouchDevice) {
  // 触屏
  canvas.ontouchstart = (e) => {
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (eraserEnable) {
      clearLine(x - lineSize, y - lineSize, lineSize)
    } else {
      lastPoint = {'x': x, 'y': y}
    }
  }
  canvas.ontouchmove = (e) => {
    let x = e.touches[0].clientX //每次移动，更新新的坐标x
    let y = e.touches[0].clientY //每次移动，更新新的坐标y
    if (eraserEnable) {
      clearLine(x - lineSize, y - lineSize, lineSize)
    } else {
      let newPoint = {'x': x, 'y': y}
      // drawLine(lastX, lastY, e.touches[0].clientX, e.touches[0].clientY)
      drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
      lastPoint = newPoint
    }
  }
} else {//PC
  canvas.onmousedown = (e) => {
    let x = e.clientX
    let y = e.clientY
    down = true
    if (eraserEnable) {
      clearLine(x - lineSize, y - lineSize, lineSize)
    } else {
      lastPoint = {'x': x, 'y': y}
    }
  }
  canvas.onmousemove = (e) => {
    let x = e.clientX
    let y = e.clientY
    if (!down) {
      return
    }
    if (eraserEnable) {
      clearLine(x - lineSize, y - lineSize, lineSize)
    } else {
      let newPoint = {'x': x, 'y': y}
      drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
      lastPoint = newPoint
    }
  }
  canvas.onmouseup = () => {
    down = false
  }
}


