/*
function a() {
  console.log("A");
}
*/

var a = function () {
  console.log("A");
  om;
};

function slowfunc(callback) {
  callback();
}

slowfunc(a);
//이름이 없는 함수를 익명함수라고 한다.
//자바스크립트에서는 함수는 값이다.
