import images from './images.js';
import { stype, keys } from '../constants';
import { initBoard } from '../constants/clasli.js';

const ROW = 10, COLUMN = 9;

export const getBoardBySetting = (redChessSeting,blackChessSeting)=>{
	const board = JSON.parse(JSON.stringify(initBoard))
	switch(redChessSeting){
		case 1:
			board[7][1]=null
			break;
		case 2:
			board[9][0]=null
			break;
		case 3:
			board[9][1]=null
			break;
		case 4:
			board[9][1]=null
			board[9][7]=null
            break;
	}
	switch(blackChessSeting){
		case 1:
			board[2][1]=null
			break;
		case 2:
			board[0][0]=null
			break;
		case 3:
			board[0][1]=null
			break;
		case 4:
			board[0][1]=null
			board[0][7]=null
            break;
	}
    return board;
} 
export const createInitBoard = (initBoard)=> {
    const board = Array.from({ length: ROW }, () => Array(COLUMN).fill(null));
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COLUMN; j++) {
            if (initBoard[i][j]) {
				board[i][j] = {}
                board[i][j].name = initBoard[i][j];
                board[i][j].isRed = initBoard[i][j] === initBoard[i][j].toLowerCase()
            }
        }
    }
    return board;
}
export const drawBg = (ctx) => {
  ctx.clearRect(0, 0, stype.width, stype.height); // 清除画布
  ctx.drawImage(images.bgImg, 0, 0);
}

export const drawPieces = (ctx, board,notTurnOver,notTurnChess) => {
	// 绘制棋子
	for (let i = 0; i < ROW; i++) {
		for (let j = 0; j < COLUMN; j++) {
			const piece = board[i][j]?.name;
			if (!piece) continue;
			ctx.save() 
			let y = (notTurnOver ? i : 9-i) * stype.spaceY + stype.pointStartY
			let x = (notTurnOver ? j : 8-j) * stype.spaceX + stype.pointStartX
			if(!notTurnChess && (notTurnOver ?!board[i][j].isRed:board[i][j].isRed)){
				ctx.translate(x + stype.spaceX / 2, y + stype.spaceY / 2);
				ctx.scale(1, -1); // 垂直翻转
				ctx.translate(-(x + stype.spaceX / 2), -(y + stype.spaceY / 2));
			}
			ctx.drawImage(images.piecesImg[keys[piece]].img,x,y);
			ctx.restore()
		}
	}
}

export const drawLastMove = (ctx,move,notTurnOver) => {
	// 绘制移动路径
	if (!move) return  
	ctx.drawImage(images.paneImg, stype.spaceX * (notTurnOver ? move.from.x : 8-move.from.x) + stype.pointStartX, stype.spaceY * (notTurnOver ? move.from.y : 9-move.from.y) + stype.pointStartY)
	ctx.drawImage(images.paneImg, stype.spaceX * (notTurnOver ? move.to.x : 8-move.to.x) + stype.pointStartX, stype.spaceY * (notTurnOver ? move.to.y : 9-move.to.y) + stype.pointStartY)
}

export const drawChosingPiece = (ctx, chosingPiecePos,ableMove,notTurnOver) => {
    if (!chosingPiecePos) return
	ctx.drawImage(images.paneImg, stype.spaceX * (notTurnOver? chosingPiecePos.x:8-chosingPiecePos.x )+ stype.pointStartX, stype.spaceY * (notTurnOver ? chosingPiecePos.y:9-chosingPiecePos.y )+ stype.pointStartY)
	for (const dot of ableMove) {
		ctx.drawImage(images.dotImg, stype.spaceX * (notTurnOver ? dot.x : 8-dot.x) + 10 + stype.pointStartX, stype.spaceY * (notTurnOver?dot.y:9-dot.y) + 10 + stype.pointStartY)
	}
}	
export const drawBoard = (ctx,chessBoard) => {
	drawBg(ctx)
	drawPieces(ctx,chessBoard.board,chessBoard.notTurnOver,chessBoard.notTurnChess)
	drawLastMove(ctx,chessBoard.move,chessBoard.notTurnOver)
	drawChosingPiece(ctx,chessBoard.chosingPiecePos,chessBoard.ableMove,chessBoard.notTurnOver)
};