import { chessValue } from "../constants";
import { doMove, getAllMoves, getIsCheck, undoMove } from "./chess.js"

const ROW = 10, COLUMN = 9;
function evaluateBoard(board,isRedTurn) {
    let score = 0;
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COLUMN; j++) {
            let piece = board[i][j]?.name;
            if (!piece) continue ;
            let pieceType = piece[0]; // 获取棋子类型
            let pieceValue = chessValue[pieceType][i][j]; // 获取该位置棋子的价值
            score += (board[i][j].isRed===isRedTurn) ? pieceValue : -pieceValue; // 红方加分，黑方减分
        }
    }
    return score;
}

// alpha 代表下界，beta代表上界
// 对于ai圆节点(Max层)，希望挑选子节点中的最大节点。所以会更新最小值α(因为每得到一个符合条件的更大的值时，以后的新值必须更大才会被选择)。
// 新的最小值α来自于已经计算的子节点(中的最大值)。但最大不能大于于父节点的β。
// 对于玩家方节点(Min层)，希望挑选子节点中的最小节点。所以会更新最大值β。新的最大值β来自于已经计算的子节点(中的最小值)。但最小不能小于父节点的α。 
function minimax(board, depth, alpha, beta, isRedTurn,isMax) {
    const currentSide = isMax ? isRedTurn : !isRedTurn
    // 如果到达了搜索深度或者 对于当前的选手而言 游戏结束，返回当前棋盘的评估值
    if (depth === 0) {
        return evaluateBoard(board,isRedTurn);
    }
    const moves = getAllMoves(board, currentSide);
    if (isMax) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const {from, to} = move;
            move.movePiece =  board[from.y][from.x]
            move.eatPiece = board[to.y][to.x]
            doMove(move,board);
            const evalue = minimax(board, depth - 1, alpha, beta,isRedTurn, false);
            undoMove(move,board);
            maxEval = Math.max(maxEval, evalue);
            alpha = Math.max(alpha, evalue);
            if (beta <= alpha) {
                break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            const {from, to} = move;
            move.movePiece =  board[from.y][from.x]
            move.eatPiece = board[to.y][to.x]
            doMove(move,board);
            let evalue = minimax(board, depth - 1, alpha, beta,isRedTurn, true);
            undoMove(move,board);
            minEval = Math.min(minEval, evalue);
            beta = Math.min(beta, evalue);
            if (beta <= alpha) {
                break;
            }
        }
        return minEval;
    }
}

// 参数为棋盘、深度、 当前ai是否红方
export function bestMove(depth, isRedTurn,board) {
    let bestEval = -Infinity ;
    let bestMove = null;
    const moves = getAllMoves(board, isRedTurn);
    for (const move of moves) {
        const {from, to} = move;
        move.movePiece =  board[from.y][from.x]
        move.eatPiece = board[to.y][to.x]
        doMove(move,board);
        if(getIsCheck(board,!isRedTurn)){
            undoMove(move,board);
            continue;
        }
        const evalue = minimax(board, depth - 1, -Infinity, Infinity, isRedTurn,false);
        undoMove(move,board);
        if (evalue > bestEval) {
            bestEval = evalue;
            bestMove = move;
        }
    }
    return bestMove; // 返回最佳走法
}

