const moveLaw = {}
const ROW = 10, COLUMN = 9;
//车
moveLaw['c'] = function (point, board) {
    var ableMove = [];
    const { x, y } = point;
    // 用于检查并添加移动位置的辅助函数
    const checkAndAddMove = (dx, dy) => {
        for (let i = 1; ; i++) {
            const newX = x + dx * i, newY = y + dy * i;
            if (newX < 0 || newX > 8 || newY < 0 || newY > 9) break;  // 检查边界
            if (board[newY][newX]) {
                if (board[newY][newX]?.isRed!=board[y][x].isRed) {
                    ableMove.push({ x: newX, y: newY });  // 如果遇到敌方棋子，则可以吃掉
                }
                break;  // 遇到任何棋子后停止搜索
            }
            ableMove.push({ x: newX, y: newY });  // 添加空位
        }
    };

    // 四个方向检索：左、右、上、下
    checkAndAddMove(-1, 0);  // 左侧
    checkAndAddMove(1, 0);   // 右侧
    checkAndAddMove(0, -1);  // 上方
    checkAndAddMove(0, 1);   // 下方

    return ableMove;
};

// 马
moveLaw['m'] = function (point, board) {
    var ableMove = [];
    const { x, y } = point;
    const checkAndAddMove = (dx, dy) => {
        const newX = x + dx, newY = y + dy;
        if (newX >= 0 && newX <= 8 && newY >= 0 && newY <= 9 &&
            board[y + Math.trunc(dy / 2)][x + Math.trunc(dx / 2)]==null && board[newY][newX]?.isRed!=board[y][x].isRed) {
            ableMove.push({ x: newX, y: newY });
        }
    };
    checkAndAddMove(1, -2);
    checkAndAddMove(2, -1);
    checkAndAddMove(2, 1);
    checkAndAddMove(1, 2);
    checkAndAddMove(-1, 2);
    checkAndAddMove(-2, 1);
    checkAndAddMove(-2, -1);
    checkAndAddMove(-1, -2);

    return ableMove;
};

// 相/象
moveLaw['x'] = function (point, board) {
    var ableMove = [];
    const { x, y } = point;
	const checkAndAddMove = (dx, dy) => {
        const newX = x + dx, newY = y + dy;
        if (newX >= 0 && newX <= 8 && 
			 newY >= 0 && newY <= 9 &&
            board[(y + Math.trunc(dy / 2))][x + Math.trunc(dx / 2)]==null &&
            board[newY][newX]?.isRed!=board[y][x].isRed) {
            if (board[y][x].isRed) {  // 红方
                if (newY >= 5 && newY <= 9) {  
                    ableMove.push({ x: newX, y: newY });
                }
            } else {  // 黑方
                if (newY >= 0 && newY <= 4) {  // 限制在九宫格的行范围内
                    ableMove.push({ x: newX, y: newY });
                }
            }
        }
    };
	checkAndAddMove(2, 2);  // 4点半
	checkAndAddMove(-2, 2);  // 7点半
	checkAndAddMove(2, -2);  // 1点半
	checkAndAddMove(-2, -2);  // 10点半

    return ableMove;
};

moveLaw['s'] = function (point, board) {
    var ableMove = [];
    const { x, y } = point;
    const checkAndAddMove = (dx, dy) => {
        const newX = x + dx, newY = y + dy;
        if (newX >= 3 && newX <= 5 && 
			 newY >= 0 && newY <= 9 &&
            (board[newY][newX]?.isRed!=board[y][x].isRed)) {
            if (board[y][x].isRed) {  // 红方
                if (newY >= 7 && newY <= 9) {  // 限制在九宫格的行范围内
                    ableMove.push({ x: newX, y: newY });
                }
            } else {  // 黑方
                if (newY >= 0 && newY <= 2) {  // 限制在九宫格的行范围内
                    ableMove.push({ x: newX, y: newY });
                }
            }
        }
    };

    // 检查四个可能的斜线移动位置
    checkAndAddMove(1, 1);  // 4点半
    checkAndAddMove(-1, 1);  // 7点半
    checkAndAddMove(1, -1);  // 1点半
    checkAndAddMove(-1, -1);  // 10点半

    return ableMove;
};

// 将/帅
moveLaw['j'] = function (point, board) {
    var ableMove = [];
    const { x, y } = point;
    const minY = board[y][x].isRed ? 7 : 0;
    const maxY = board[y][x].isRed? 9 : 2;
    const checkAndAddMove = (dx, dy) => {
        const newX = x + dx, newY = y + dy;
        if (newX >= 3 && newX <= 5 && newY >= minY && newY <= maxY && board[newY][newX]?.isRed!=board[y][x].isRed) {
            ableMove.push({ x: newX, y: newY });
        }
    };

    checkAndAddMove(0, 1);  // 下
    checkAndAddMove(0, -1);  // 上
    checkAndAddMove(1, 0);  // 右
    checkAndAddMove(-1, 0);  // 左
    return ableMove;
};

// 炮
moveLaw['p'] = function (point, board) {
    var ableMove = [];
    const { x, y } = point;

    // 四个方向检索
    const checkAndAddMove = (dx, dy) =>  {
        let jumped = false;
        for (let i = 1; ; i++) {
            const newX = x + dx * i, newY = y + dy * i;
            if (newX < 0 || newX > 8 || newY < 0 || newY > 9) break;  // 越界
            if (board[newY][newX]) {
                if (!jumped) {
                    jumped = true;  // 第一次遇到棋子跳过
                    continue;
                }
                if (board[newY][newX]?.isRed!=board[y][x].isRed) {
                    ableMove.push({ x: newX, y: newY });  // 遇到第二个棋子，可以吃掉
                }
                break;  // 不管能否吃子，遇到第二个棋子后停止搜索
            }
            if (!jumped) ableMove.push({ x: newX, y: newY });  // 未跳过任何棋子时添加空位
        }
    };
    checkAndAddMove(-1,0);
    checkAndAddMove(1,0);
    checkAndAddMove(0,-1);
    checkAndAddMove(0,1);
    return ableMove;
};

// 卒/兵
moveLaw['z'] = function (point, board) {
    var ableMove = [];
    const { x, y } = point;
    const checkAndAddMove = (dx, dy) => {
        const newX = x + dx, newY = y + dy;
        if (newX >= 0 && newX <= 8 && newY >= 0 && newY <= 9 && board[newY][newX]?.isRed!=board[y][x].isRed) {
            ableMove.push({ x: newX, y: newY });
        }
    };

    if (board[y][x].isRed) {  // 红方
        checkAndAddMove(0, -1);  // 上
        if (y <= 4) {
            checkAndAddMove(1, 0);  // 右
            checkAndAddMove(-1, 0);  // 左
        }
    } else {  // 黑方
        checkAndAddMove(0, 1);  // 下
        if (y >= 5) {
            checkAndAddMove(1, 0);  // 右
            checkAndAddMove(-1, 0);  // 左
        }
    }

    return ableMove;
};
const getMyGeneralPos = (board,isRedTurn)=>{
    for (let i = (isRedTurn ? 7 : 0); i < (isRedTurn?10:3); i++) {
        for (let j = 3; j < 6; j++) {
            let piece = board[i][j]?.name[0];
            if (piece && (isRedTurn ? piece === 'j' : piece === 'J')) {
                return {x: j, y: i};
            }
        }
    }
    return null
}

export const getAllMoves=(board, isRedTurn) =>{
    let moves = [];
    // 遍历棋盘，找到当前玩家的所有棋子
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COLUMN; j++) {
            let piece = board[i][j]?.name[0];
            if (piece && (isRedTurn ? piece.toLowerCase() === piece : piece.toUpperCase() === piece)) {
                piece = piece.toLowerCase()
                const getAbleMove = moveLaw[piece];
                const ableMove = getAbleMove({y:i,x:j},board);
                ableMove.forEach(item => (
                    moves.push({from:{y:i,x:j},to:{y:item.y,x:item.x}})
                ));
            }
        }
    }
    return moves;
}


export const doMove=(move,board)=>{
    const {from,to} = move;
    board[to.y][to.x] = board[from.y][from.x]
    board[from.y][from.x] = null
}

export const undoMove = (move,board)=>{
    if(!move) return
    const {from,to,movePiece,eatPiece} = move;
    board[to.y][to.x] =  eatPiece 
    board[from.y][from.x] = movePiece
}

// 下棋的一方将军
export const getIsCheck = (board, isRedTurn) =>{
    const myGenPos  = getMyGeneralPos(board,isRedTurn)
    const enemyGenPos = getMyGeneralPos(board,!isRedTurn)
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COLUMN; j++) {
            let piece = board[i][j]?.name[0];
            if (piece && (isRedTurn ? piece.toLowerCase() === piece : piece.toUpperCase() === piece)) {
                piece = piece.toLowerCase()
                const getAbleMove = moveLaw[piece];
                const ableMove = getAbleMove({y:i,x:j},board);
                for(const move of ableMove){
                    if(move.x === enemyGenPos.x && move.y === enemyGenPos.y){
                        return true
                    }
                }
            }
        }
    }
    if(myGenPos.x === enemyGenPos.x){
        for(let i = Math.min(myGenPos.y,enemyGenPos.y)+1; i<Math.max(myGenPos.y,enemyGenPos.y);i++){
            if(board[i][myGenPos.x]) return false
        }
        return true
    }
    return false;
}

// 判断是否绝杀
export const getIsCheckMate = (board, isRedTurn) =>{
    const enemyMoves = getAllMoves(board, !isRedTurn)
    for(const move of enemyMoves){
        const {from, to} = move;
        move.movePiece =  board[from.y][from.x]
        move.eatPiece = board[to.y][to.x]
        doMove(move,board);
        const res = getIsCheck(board,isRedTurn)
        undoMove(move,board);
        if(!res)return false
    }
    return true
}


export default moveLaw;