// utils/images.js
import { chessArgs } from "../constants";
const loadImages = () => {
  return new Promise((resolve, reject) => {
    const images = {};

    // 绘制棋盘
    images.bgImg = new Image();
    images.bgImg.src = "/img/bg.png";
    images.bgImg.onload = onImageLoad;
    images.bgImg.onerror = onError;

    // 提示点
    images.dotImg = new Image();
    images.dotImg.src = "/img/dot.png";
    images.dotImg.onload = onImageLoad;
    images.dotImg.onerror = onError;

    // 棋子外框
    images.paneImg = new Image();
    images.paneImg.src = "/img/r_box.png";
    images.paneImg.onload = onImageLoad;
    images.paneImg.onerror = onError;

    // 棋子
    images.piecesImg = [];
    for (const i in chessArgs) {
      images.piecesImg[i] = {};
      images.piecesImg[i].img = new Image();
      images.piecesImg[i].img.src = `/img/${chessArgs[i].img}.png`;
      images.piecesImg[i].img.onload = onImageLoad;
      images.piecesImg[i].img.onerror = onError;
    }

    let loadedCount = 0;
    const totalImages = 3 + Object.keys(chessArgs).length; // 背景图、提示点、外框加所有棋子

    function onImageLoad() {
      if (++loadedCount === totalImages) {
        resolve(images);
      }
    }

    function onError(error) {
      reject(error);
    }
  });
};
const images = await loadImages(); 
export default images;