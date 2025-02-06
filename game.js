// ゲーム状態
let gameActive = false;
let waitingForClick = false;
let showTimeout = null;
let startTime = 0;
let times = [];
let misses = 0;

// DOM要素
const targetArea = document.getElementById('target-area');
const targetImage = document.getElementById('target-image');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const bestTimeDisplay = document.getElementById('best-time');
const lastTimeDisplay = document.getElementById('last-time');
const averageTimeDisplay = document.getElementById('average-time');
const missesDisplay = document.getElementById('misses');

// ゲーム設定
const MIN_WAIT_TIME = 2000;  // 最小待ち時間（ミリ秒）
const MAX_WAIT_TIME = 7000;  // 最大待ち時間（ミリ秒）
const MAX_TIMES_STORED = 10; // 記録する記録の最大数

// ターゲット画像の位置をランダムに設定
function setRandomPosition() {
    const areaWidth = targetArea.clientWidth - targetImage.clientWidth;
    const areaHeight = targetArea.clientHeight - targetImage.clientHeight;
    
    const left = Math.random() * areaWidth;
    const top = Math.random() * areaHeight;
    
    targetImage.style.left = `${left}px`;
    targetImage.style.top = `${top}px`;
}

// ターゲットを表示
function showTarget() {
    setRandomPosition();
    targetImage.style.display = 'block';
    startTime = performance.now();
    waitingForClick = true;
}

// ゲームをスタート
function startGame() {
    if (gameActive) return;
    
    gameActive = true;
    startButton.textContent = '実行中...';
    startButton.disabled = true;
    
    // ランダムな時間後にターゲットを表示
    const waitTime = MIN_WAIT_TIME + Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME);
    showTimeout = setTimeout(showTarget, waitTime);
}

// ゲームをリセット
function resetGame() {
    gameActive = false;
    waitingForClick = false;
    if (showTimeout) {
        clearTimeout(showTimeout);
        showTimeout = null;
    }
    targetImage.style.display = 'none';
    startButton.textContent = 'ゲーム開始';
    startButton.disabled = false;
    times = [];
    misses = 0;
    updateDisplays();
}

// 記録を更新
function updateDisplays() {
    const bestTime = times.length > 0 ? Math.min(...times) : null;
    const lastTime = times.length > 0 ? times[times.length - 1] : null;
    const averageTime = times.length > 0 ? times.reduce((a, b) => a + b) / times.length : null;
    
    bestTimeDisplay.textContent = bestTime ? bestTime.toFixed(3) : '-.---';
    lastTimeDisplay.textContent = lastTime ? lastTime.toFixed(3) : '-.---';
    averageTimeDisplay.textContent = averageTime ? averageTime.toFixed(3) : '-.---';
    missesDisplay.textContent = misses;
}

// クリックイベントの処理
targetArea.addEventListener('click', () => {
    if (!gameActive) return;
    
    if (waitingForClick) {
        // 正しいタイミングでのクリック
        const reactionTime = (performance.now() - startTime) / 1000; // 秒に変換
        times.push(reactionTime);
        if (times.length > MAX_TIMES_STORED) {
            times.shift(); // 古い記録を削除
        }
        
        targetImage.style.display = 'none';
        waitingForClick = false;
        gameActive = false;
        startButton.textContent = 'ゲーム開始';
        startButton.disabled = false;
        
        updateDisplays();
    } else {
        // お手つき（早すぎるクリック）
        misses++;
        if (showTimeout) {
            clearTimeout(showTimeout);
            showTimeout = null;
        }
        
        gameActive = false;
        startButton.textContent = 'ゲーム開始';
        startButton.disabled = false;
        
        updateDisplays();
        alert('お手つき！\n画像が表示される前にクリックしてしまいました。');
    }
});

// ボタンのイベントリスナー
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

// 初期表示の更新
updateDisplays();
