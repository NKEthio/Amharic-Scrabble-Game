import React from 'react';
import { BookOpen, HelpCircle, Trophy, Sparkles, AlertCircle, Eye, RefreshCw, ChevronRight, Sun, Moon } from 'lucide-react';
import { LEVELS, type WordEntry } from './data/levels';
import { toGeezNumber } from './utils/geez';
import { normalizeAmharic, getLetterPoints } from './utils/amharic';
import confetti from 'canvas-confetti';

export function App() {
  const [currentLevelIdx, setCurrentLevelIdx] = React.useState(0);
  const currentLevel = LEVELS[currentLevelIdx];

  // Board grid representation: (row, col) -> char string
  const [gridState, setGridState] = React.useState<Record<string, string>>({});

  // Selected tile index from player rack
  const [selectedRackTile, setSelectedRackTile] = React.useState<{ char: string; index: number } | null>(null);

  // Player state
  const [score, setScore] = React.useState(0);
  const [tokens, setTokens] = React.useState(15); // Start with 15 tokens
  const [completedLevels, setCompletedLevels] = React.useState<number[]>([]);

  // Theme state: 'night' (default) or 'day'
  const [themeMode, setThemeMode] = React.useState<'night' | 'day'>('night');

  // Modals & UI states
  const [showRulesModal, setShowRulesModal] = React.useState(false);
  const [showLevelSuccessModal, setShowLevelSuccessModal] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  // Rack tiles state for the level
  const [rackTiles, setRackTiles] = React.useState<Array<{ char: string; id: string }>>([]);

  // Initialize level
  React.useEffect(() => {
    const initialGrid: Record<string, string> = {};
    setGridState(initialGrid);
    setSelectedRackTile(null);

    // Populate initial rack
    const levelRack = currentLevel.rackTiles.map((char: string, index: number) => ({
      char,
      id: `${char}-${index}-${Date.now()}`
    }));
    setRackTiles(levelRack);
  }, [currentLevelIdx, currentLevel]);

  // Set of all active (playable word) cell keys in current level grid
  const activeCells = React.useMemo(() => {
    const set = new Set<string>();
    currentLevel.words.forEach((w: WordEntry) => {
      for (let i = 0; i < w.word.length; i++) {
        const r = w.direction === 'across' ? w.startRow : w.startRow + i;
        const c = w.direction === 'across' ? w.startCol + i : w.startCol;
        set.add(`${r}-${c}`);
      }
    });
    return set;
  }, [currentLevel]);

  // Compute cell clue numbers and starting positions
  const wordMap = React.useMemo(() => {
    const map: Record<string, { clueNum: number; words: WordEntry[] }> = {};
    let clueCounter = 1;

    currentLevel.words.forEach((w: WordEntry) => {
      const key = `${w.startRow}-${w.startCol}`;
      if (!map[key]) {
        map[key] = { clueNum: clueCounter++, words: [] };
      }
      map[key].words.push(w);
    });

    return map;
  }, [currentLevel]);

  // Check if a word on board is correctly filled (using Option A Homophone equivalence)
  const checkWordSolved = (w: WordEntry, grid: Record<string, string>): boolean => {
    for (let i = 0; i < w.word.length; i++) {
      const r = w.direction === 'across' ? w.startRow : w.startRow + i;
      const c = w.direction === 'across' ? w.startCol + i : w.startCol;
      const placedChar = grid[`${r}-${c}`];
      if (!placedChar) return false;

      const targetChar = w.word[i];
      if (normalizeAmharic(placedChar) !== normalizeAmharic(targetChar)) {
        return false;
      }
    }
    return true;
  };

  // Check overall level completion
  React.useEffect(() => {
    if (!currentLevel) return;
    const allSolved = currentLevel.words.every((w: WordEntry) => checkWordSolved(w, gridState));

    if (allSolved && currentLevel.words.length > 0 && !completedLevels.includes(currentLevel.levelNumber)) {
      setCompletedLevels((prev) => [...prev, currentLevel.levelNumber]);
      setScore((prev) => prev + currentLevel.targetScore);
      setTokens((prev) => prev + 10); // Reward 10 tokens for level complete!
      setShowLevelSuccessModal(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [gridState, currentLevel, completedLevels]);

  // Handle cell click (place tile from rack or clear cell)
  const handleCellClick = (r: number, c: number) => {
    const cellKey = `${r}-${c}`;
    const existingChar = gridState[cellKey];

    if (selectedRackTile) {
      // Place selected rack tile into cell
      const newGrid = { ...gridState, [cellKey]: selectedRackTile.char };
      setGridState(newGrid);

      // Calculate score increment for valid letter placement
      setScore((prev) => prev + getLetterPoints(selectedRackTile.char));

      // If cell already had a tile, return it to the rack
      let updatedRack = rackTiles.filter((_, idx) => idx !== selectedRackTile.index);
      if (existingChar) {
        updatedRack = [...updatedRack, { char: existingChar, id: `${existingChar}-${Date.now()}` }];
      }
      setRackTiles(updatedRack);
      setSelectedRackTile(null);
    } else if (existingChar) {
      // Return placed tile back to rack
      setRackTiles((prev) => [...prev, { char: existingChar, id: `${existingChar}-${Date.now()}` }]);
      const newGrid = { ...gridState };
      delete newGrid[cellKey];
      setGridState(newGrid);
    }
  };

  // Reveal Answer for a word (Costs 5 tokens)
  const handleRevealWord = (w: WordEntry) => {
    if (tokens < 5) {
      setStatusMessage("መልስ ለማየት ፭ ቶከን ያስፈልጋል! (Not enough tokens!)");
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    setTokens((prev) => prev - 5);

    const newGrid = { ...gridState };
    for (let i = 0; i < w.word.length; i++) {
      const r = w.direction === 'across' ? w.startRow : w.startRow + i;
      const c = w.direction === 'across' ? w.startCol + i : w.startCol;
      newGrid[`${r}-${c}`] = w.word[i];
    }
    setGridState(newGrid);
    setStatusMessage(`"${w.word}" የሚለው ቃል ተገልጧል!`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Reset current level
  const handleResetLevel = () => {
    setGridState({});
    setSelectedRackTile(null);
    const levelRack = currentLevel.rackTiles.map((char: string, index: number) => ({
      char,
      id: `${char}-${index}-${Date.now()}`
    }));
    setRackTiles(levelRack);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans border-t-4 border-emerald-500 mode-${themeMode}`}>
      {/* Top Navigation Header */}
      <header className="app-header px-4 py-3 flex flex-wrap items-center justify-between shadow-md border-b relative z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-emerald-600 via-amber-500 to-red-600 flex items-center justify-center font-bold text-xl text-white shadow">
            ስ
          </div>
          <div>
            <h1 className="text-xl font-bold ethiopian-text-gradient leading-tight">
              አማርኛ ስክራብል (Amharic Scrabble)
            </h1>
            <p className="text-xs text-[#a89a8b]">የቃላት ጨዋታ ከጥቆማዎች ጋር</p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <div className="flex items-center space-x-1.5 bg-[#17130e] px-3 py-1.5 rounded-full border border-[#3d3226] text-amber-400 font-medium text-sm">
            <Trophy className="w-4 h-4" />
            <span>ነጥብ: {toGeezNumber(score)} ({score})</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#17130e] px-3 py-1.5 rounded-full border border-[#3d3226] text-emerald-400 font-medium text-sm">
            <Sparkles className="w-4 h-4" />
            <span>ቶከን: {toGeezNumber(tokens)} ({tokens})</span>
          </div>

          {/* Day / Night Theme Toggle Button */}
          <button
            onClick={() => setThemeMode((prev) => (prev === 'night' ? 'day' : 'night'))}
            className="flex items-center space-x-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 text-xs px-3 py-1.5 rounded-lg border border-amber-600/40 transition cursor-pointer font-semibold"
            title="ቀን / ማታ ይቀይሩ (Toggle Day / Night Mode)"
          >
            {themeMode === 'night' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>ቀን (Day)</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-amber-700" />
                <span>ማታ (Night)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowRulesModal(true)}
            className="flex items-center space-x-1 bg-amber-900/30 hover:bg-amber-800/40 text-amber-200 text-xs px-3 py-1.5 rounded-lg border border-amber-700/40 transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>ሕጎች (Rules)</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Left Column: Game Board & Rack */}
        <section className="md:col-span-7 flex flex-col items-center space-y-4">

          {/* Level Header Bar */}
          <div className="w-full flex items-center justify-between card-bg p-3 rounded-xl border">
            <div>
              <span className="text-xs text-amber-500 font-semibold uppercase tracking-wider">የአሁኑ ደረጃ</span>
              <h2 className="text-lg font-bold">{currentLevel.title}</h2>
            </div>
            <button
              onClick={handleResetLevel}
              className="p-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 rounded-lg transition cursor-pointer"
              title="እንደገና ጀምር (Reset Level)"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="w-full bg-amber-900/60 border border-amber-600 text-amber-200 text-xs px-3 py-2 rounded-lg flex items-center space-x-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Scrabble Grid */}
          <div
            className="grid gap-1 board-bg p-3 rounded-2xl border-2 shadow-2xl"
            style={{
              gridTemplateColumns: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))`,
              width: '100%',
              maxWidth: '440px',
              aspectRatio: '1/1'
            }}
          >
            {Array.from({ length: currentLevel.gridSize }).map((_, r) =>
              Array.from({ length: currentLevel.gridSize }).map((_, c) => {
                const cellKey = `${r}-${c}`;
                const isActive = activeCells.has(cellKey);
                const char = gridState[cellKey];
                const startInfo = wordMap[cellKey];

                if (!isActive) {
                  return (
                    <div
                      key={cellKey}
                      className="wooden-wall-block rounded-lg aspect-square w-full h-full"
                      aria-hidden="true"
                    />
                  );
                }

                return (
                  <button
                    key={cellKey}
                    onClick={() => handleCellClick(r, c)}
                    className={`relative rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-150 select-none aspect-square w-full h-full p-0 overflow-hidden ${
                      char
                        ? 'wood-tile shadow-md cursor-pointer'
                        : 'empty-cell border'
                    }`}
                  >
                    {/* Ge'ez Clue Number Badge */}
                    {startInfo && (
                      <span className="absolute top-0.5 left-1 text-[13px] text-amber-400 font-extrabold leading-none z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] opacity-100">
                        {toGeezNumber(startInfo.clueNum)}
                      </span>
                    )}

                    {/* Placed Character */}
                    {char && <span>{char}</span>}

                    {/* Subscript Points */}
                    {char && (
                      <span className="absolute bottom-0.5 right-1 text-[9px] text-[#5c3a17] font-semibold">
                        {getLetterPoints(char)}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Tile Rack */}
          <div className="w-full card-bg p-4 rounded-xl border shadow-lg flex flex-col items-center space-y-2">
            <span className="text-xs opacity-80 font-medium">የፊደላት ሳጥን (Tile Rack) - ለማስቀመጥ ጠቅ ያድርጉ</span>
            <div className="flex flex-wrap justify-center gap-2">
              {rackTiles.map((tile, idx) => {
                const isSelected = selectedRackTile?.index === idx;
                return (
                  <button
                    key={tile.id}
                    onClick={() =>
                      setSelectedRackTile(isSelected ? null : { char: tile.char, index: idx })
                    }
                    className={`w-11 h-11 wood-tile rounded-lg font-bold text-xl flex items-center justify-center relative transition transform cursor-pointer ${
                      isSelected ? 'ring-4 ring-amber-400 -translate-y-2 scale-105' : 'hover:-translate-y-1'
                    }`}
                  >
                    <span>{tile.char}</span>
                    <span className="absolute bottom-0.5 right-1 text-[9px] text-[#5c3a17]">
                      {getLetterPoints(tile.char)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        {/* Right Column: Clues / Definitions & Progression */}
        <section className="md:col-span-5 flex flex-col space-y-4">

          {/* Definitions / Clues Card */}
          <div className="card-bg rounded-xl border p-4 shadow-lg flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-amber-800/30 pb-2 mb-3">
              <div className="flex items-center space-x-2 text-amber-500 font-semibold">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <span>ጥቆማዎችና ትርጓሜዎች (Clues)</span>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
              {currentLevel.words.map((w: WordEntry) => {
                const isSolved = checkWordSolved(w, gridState);
                const startCellKey = `${w.startRow}-${w.startCol}`;
                const clueNum = wordMap[startCellKey]?.clueNum || 1;

                return (
                  <div
                    key={w.id}
                    className={`p-3 rounded-lg border transition ${
                      isSolved
                        ? 'bg-emerald-900/30 border-emerald-600/50 text-emerald-400'
                        : 'clue-card'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="bg-amber-800/60 text-amber-200 text-xs font-bold px-2 py-0.5 rounded">
                          {toGeezNumber(clueNum)} ({w.direction === 'across' ? 'አግድም' : 'ቁልቁል'})
                        </span>
                        {w.category && (
                          <span className="text-[10px] bg-[#33281d] text-amber-500/80 px-1.5 py-0.5 rounded border border-[#453728]">
                            {w.category}
                          </span>
                        )}
                      </div>

                      {/* Reveal Button */}
                      {!isSolved && (
                        <button
                          onClick={() => handleRevealWord(w)}
                          className="flex items-center space-x-1 text-[11px] bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 px-2 py-1 rounded border border-amber-600/40 transition cursor-pointer"
                          title="መልስ ተመልከት (5 ቶከን)"
                        >
                          <Eye className="w-3 h-3" />
                          <span>መልስ (፭ ቶከን)</span>
                        </button>
                      )}
                    </div>

                    <p className="text-sm mt-2 font-medium">{w.clue}</p>

                    {isSolved && (
                      <div className="mt-2 text-xs text-emerald-400 font-bold flex items-center space-x-1">
                        <span>✓ ተመልሷል: {w.word}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level Switcher */}
          <div className="card-bg p-3 rounded-xl border flex items-center justify-between">
            <span className="text-xs opacity-80 font-medium">ደረጃዎች (Levels)</span>
            <div className="flex space-x-2">
              {LEVELS.map((lvl, idx: number) => (
                <button
                  key={lvl.levelNumber}
                  onClick={() => setCurrentLevelIdx(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    currentLevelIdx === idx
                      ? 'bg-amber-600 text-white shadow'
                      : 'stat-badge border text-amber-500 hover:bg-amber-600/20'
                  }`}
                >
                  {toGeezNumber(lvl.levelNumber)}
                </button>
              ))}
            </div>
          </div>

        </section>
      </main>

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card-bg border-2 border-amber-600/60 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold ethiopian-text-gradient mb-3">
              የአማርኛ ስክራብል ሕጎች (Game Rules)
            </h3>

            <div className="space-y-3 text-sm opacity-90 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="clue-card p-3 rounded-lg border">
                <h4 className="font-bold text-amber-500 mb-1">፩. የድምፅ ተመሳስሎ አጠቃቀም (Homophone Normalization)</h4>
                <p className="text-xs">
                  በአማርኛ ፊደላት ተመሳሳይ ድምፅ ያላቸው (ለምሳሌ፡ ሠ እና ሰ፣ ሀ እና ሐ እና ኀ) እንደ አንድ ፊደል ይቆጠራሉ።
                  በመሆኑም "ሠላም" ለሚለው ቃል "ሰላም" ብለው ቢያስገቡ ጨዋታው እንደ ትክክለኛ መልስ ይቀበለዋል።
                </p>
              </div>

              <div className="clue-card p-3 rounded-lg border">
                <h4 className="font-bold text-amber-500 mb-1">፪. የግዕዝ ቁጥሮች (Ge'ez Numerals)</h4>
                <p className="text-xs">
                  የጨዋታው ነጥቦች፣ የቶከን ብዛት እና ጥቆማዎች በግዕዝ ቁጥሮች (፩, ፪, ፫, ፬...) ይገለጻሉ።
                </p>
              </div>

              <div className="clue-card p-3 rounded-lg border">
                <h4 className="font-bold text-amber-500 mb-1">፫. ጥቆማዎች እና ቶከን (Hints & Tokens)</h4>
                <p className="text-xs">
                  ቃላትን ማግኘት ካልቻሉ ፭ ቶከን በመጠቀም መልሱን ማየት ይችላሉ። ደረጃዎችን ሲያጠናቅቁ ተጨማሪ ቶከን ያገኛሉ።
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="mt-5 w-full py-2 bg-amber-600 hover:bg-amber-700 font-bold rounded-xl text-white transition cursor-pointer"
            >
              ተረድቻለሁ (Got it)
            </button>
          </div>
        </div>
      )}

      {/* Level Success Modal */}
      {showLevelSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card-bg border-2 border-emerald-500 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
            <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-3 animate-bounce" />
            <h3 className="text-2xl font-extrabold text-emerald-400 mb-1">እንኳን ደስ አለዎት!</h3>
            <p className="opacity-80 text-sm mb-4">
              ደረጃ {toGeezNumber(currentLevel.levelNumber)}ን በተሳካ ሁኔታ አጠናቀዋል!
            </p>

            <div className="clue-card p-3 rounded-xl border mb-5 flex justify-around">
              <div>
                <span className="text-xs opacity-80">የተገኘ ነጥብ</span>
                <p className="text-xl font-bold text-amber-500">+{toGeezNumber(currentLevel.targetScore)}</p>
              </div>
              <div>
                <span className="text-xs opacity-80">የተበረከተ ቶከን</span>
                <p className="text-xl font-bold text-emerald-500">+፲ (10)</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowLevelSuccessModal(false);
                if (currentLevelIdx < LEVELS.length - 1) {
                  setCurrentLevelIdx((prev) => prev + 1);
                }
              }}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold rounded-xl text-white flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <span>{currentLevelIdx < LEVELS.length - 1 ? 'ወደ ሚቀጥለው ደረጃ (Next Level)' : 'ደረጃውን አጠናቅቀዋል! (Done)'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
