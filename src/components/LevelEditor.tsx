import React, { useState } from 'react';
import { Plus, Trash2, Copy, Play, Check, AlertTriangle, Grid, Sparkles, BookOpen, Layers } from 'lucide-react';
import type { LevelConfig, WordEntry } from '../data/levels';
import { validateGridWords, generateRackTiles, formatLevelAsTypeScript } from '../utils/levelEditor';

interface LevelEditorProps {
  onPlayTestLevel: (level: LevelConfig) => void;
  onClose?: () => void;
}

export const LevelEditor: React.FC<LevelEditorProps> = ({ onPlayTestLevel }) => {
  const [levelNumber, setLevelNumber] = useState<number>(4);
  const [title, setTitle] = useState<string>('ደረጃ ፬ - ብጁ ደረጃ (Custom Level)');
  const [gridSize, setGridSize] = useState<number>(7);
  const [targetScore, setTargetScore] = useState<number>(50);
  const [distractorTiles, setDistractorTiles] = useState<string>('ሀለበ');

  const [words, setWords] = useState<WordEntry[]>([
    {
      id: '1-across',
      word: 'ሰላም',
      clue: 'እርቅና ጤና (Peace)',
      direction: 'across',
      startRow: 1,
      startCol: 1,
      category: 'ባህል'
    },
    {
      id: '2-down',
      word: 'ሰው',
      clue: 'የሰው ልጅ (Human)',
      direction: 'down',
      startRow: 1,
      startCol: 1,
      category: 'ማህበራዊ'
    }
  ]);

  // Selected cell on grid preview for easy row/col selection
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // Form for active editing or new word
  const [editingWordId, setEditingWordId] = useState<string | null>(null);
  const [wordInput, setWordInput] = useState<string>('');
  const [clueInput, setClueInput] = useState<string>('');
  const [directionInput, setDirectionInput] = useState<'across' | 'down'>('across');
  const [startRowInput, setStartRowInput] = useState<number>(0);
  const [startColInput, setStartColInput] = useState<number>(0);
  const [categoryInput, setCategoryInput] = useState<string>('');

  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Validate current layout
  const validation = validateGridWords(words);
  const rackTiles = generateRackTiles(words, distractorTiles);

  const currentLevelConfig: LevelConfig = {
    levelNumber,
    title,
    gridSize,
    targetScore,
    words,
    rackTiles
  };

  const codeOutput = formatLevelAsTypeScript(currentLevelConfig);

  // Select cell on grid preview
  const handleGridCellClick = (r: number, c: number) => {
    setSelectedCell({ row: r, col: c });
    setStartRowInput(r);
    setStartColInput(c);
  };

  // Add or update word
  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordInput.trim() || !clueInput.trim()) return;

    if (editingWordId) {
      setWords((prev) =>
        prev.map((w) =>
          w.id === editingWordId
            ? {
                ...w,
                word: wordInput.trim(),
                clue: clueInput.trim(),
                direction: directionInput,
                startRow: startRowInput,
                startCol: startColInput,
                category: categoryInput.trim() || undefined
              }
            : w
        )
      );
      setEditingWordId(null);
    } else {
      const newId = `${words.length + 1}-${directionInput}`;
      const newWord: WordEntry = {
        id: newId,
        word: wordInput.trim(),
        clue: clueInput.trim(),
        direction: directionInput,
        startRow: startRowInput,
        startCol: startColInput,
        category: categoryInput.trim() || undefined
      };
      setWords((prev) => [...prev, newWord]);
    }

    // Reset inputs
    setWordInput('');
    setClueInput('');
    setCategoryInput('');
  };

  const handleEditWord = (w: WordEntry) => {
    setEditingWordId(w.id);
    setWordInput(w.word);
    setClueInput(w.clue);
    setDirectionInput(w.direction);
    setStartRowInput(w.startRow);
    setStartColInput(w.startCol);
    setCategoryInput(w.category || '');
  };

  const handleDeleteWord = (id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
    if (editingWordId === id) {
      setEditingWordId(null);
      setWordInput('');
      setClueInput('');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeOutput);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6 text-amber-100">
      {/* Level Builder Header */}
      <div className="card-bg p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold ethiopian-text-gradient flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-500" />
            የደረጃዎችና ቃላት መሥሪያ (Dev Mode - Level & Word Builder)
          </h2>
          <p className="text-xs text-amber-400/80 mt-1">
            ቃላትንና ጥቆማዎችን በሜዳው ላይ በቀላሉ በማስቀመጥ አዲስ ደረጃ ይፍጠሩ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onPlayTestLevel(currentLevelConfig)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-md cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>አሁን በሞከራ ይጫወቱ (Play Test Level)</span>
          </button>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-md cursor-pointer"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'ተቀድቷል! (Copied)' : 'ኮድ ቅዳ (Copy TypeScript)'}</span>
          </button>
        </div>
      </div>

      {/* Conflicts warning */}
      {validation.hasConflict && (
        <div className="bg-red-900/60 border border-red-500 text-red-200 text-xs p-3 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <div>
            <span className="font-bold">የፊደላት አለመጣጣም አለ! (Grid Conflict Detected):</span>
            <ul className="list-disc list-inside mt-1">
              {validation.conflicts.map((conf, idx) => (
                <li key={idx}>
                  መስመር {conf.row + 1}፣ ዓምድ {conf.col + 1} ላይ "{conf.char1}" እና "{conf.char2}" ይጋጫሉ።
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Settings & Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Column 1: Config Form & Word List */}
        <div className="md:col-span-6 space-y-4">
          {/* Level Metadata */}
          <div className="card-bg p-4 rounded-xl border space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 border-b border-amber-800/40 pb-2">
              <Grid className="w-4 h-4" />
              1. የደረጃው መረጃ (Level Parameters)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-amber-300/80 mb-1 font-semibold">ደረጃ ቁጥር (Level #)</label>
                <input
                  type="number"
                  value={levelNumber}
                  onChange={(e) => setLevelNumber(Number(e.target.value))}
                  className="w-full bg-[#1c1610] border border-[#4d3c2c] rounded p-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-amber-300/80 mb-1 font-semibold">የሜዳ ስፋት (Grid Size)</label>
                <select
                  value={gridSize}
                  onChange={(e) => setGridSize(Number(e.target.value))}
                  className="w-full bg-[#1c1610] border border-[#4d3c2c] rounded p-2 text-white font-bold"
                >
                  <option value={5}>5 x 5 (Beginner)</option>
                  <option value={7}>7 x 7 (Standard)</option>
                  <option value={8}>8 x 8 (Intermediate)</option>
                  <option value={9}>9 x 9 (Large)</option>
                  <option value={10}>10 x 10 (Advanced)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-amber-300/80 mb-1 font-semibold">የደረጃው ርዕስ (Title)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1c1610] border border-[#4d3c2c] rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-amber-300/80 mb-1 font-semibold">ዒላማ ነጥብ (Target Score)</label>
                <input
                  type="number"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full bg-[#1c1610] border border-[#4d3c2c] rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-amber-300/80 mb-1 font-semibold">ተጨማሪ ፊደላት (Distractor Tiles)</label>
                <input
                  type="text"
                  value={distractorTiles}
                  onChange={(e) => setDistractorTiles(e.target.value)}
                  placeholder="e.g. ሀለበ"
                  className="w-full bg-[#1c1610] border border-[#4d3c2c] rounded p-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Add / Edit Word Form */}
          <form onSubmit={handleSaveWord} className="card-bg p-4 rounded-xl border space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 border-b border-amber-800/40 pb-2">
              <BookOpen className="w-4 h-4" />
              2. {editingWordId ? 'ቃል ማስተካከያ (Edit Word)' : 'አዲስ ቃል ጨምር (Add Word)'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-300/80 mb-1 font-semibold">የአማርኛ ቃል (Target Word)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ሰላም"
                    value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                    className="w-full bg-[#1c1610] border border-[#4d3c2c] rounded p-2 text-amber-200 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-amber-300/80 mb-1 font-semibold">አቅጣጫ (Direction)</label>
                  <select
                    value={directionInput}
                    onChange={(e) => setDirectionInput(e.target.value as 'across' | 'down')}
                    className="w-full bg-[#1c1610] border border-[#4d3c2c] rounded p-2 text-white"
                  >
                    <option value="across">አግድም (Across)</option>
                    <option value="down">ቁልቁል (Down)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-amber-300/80 mb-1 font-semibold">ጥቆማ / ትርጓሜ (Clue / Description)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. እርቅና ሰላም (Peace & harmony)"
                  value={clueInput}
                  onChange={(e) => setClueInput(e.target.value)}
                  className="w-full bg-[#1c1610] border border-[#4d3c2c] rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-amber-300/80 mb-1 font-semibold">መነሻ መስመር (Row 0-{gridSize - 1})</label>
                  <input
                    type="number"
                    min={0}
                    max={gridSize - 1}
                    value={startRowInput}
                    onChange={(e) => setStartRowInput(Number(e.target.value))}
                    className="w-full bg-[#1c1610] border border-[#4d3c2c] rounded p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-amber-300/80 mb-1 font-semibold">መነሻ ዓምድ (Col 0-{gridSize - 1})</label>
                  <input
                    type="number"
                    min={0}
                    max={gridSize - 1}
                    value={startColInput}
                    onChange={(e) => setStartColInput(Number(e.target.value))}
                    className="w-full bg-[#1c1610] border border-[#4d3c2c] rounded p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-amber-300/80 mb-1 font-semibold">ምድብ (Category)</label>
                  <input
                    type="text"
                    placeholder="e.g. ባህል"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full bg-[#1c1610] border border-[#4d3c2c] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingWordId ? 'ቃል አስቀምጥ (Save Word)' : 'ቃል ጨምር (Add Word)'}</span>
                </button>
                {editingWordId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWordId(null);
                      setWordInput('');
                      setClueInput('');
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-3 py-2 rounded cursor-pointer"
                  >
                    ሰርዝ
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Active Words List */}
          <div className="card-bg p-4 rounded-xl border space-y-2">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              የተጨመሩ ቃላት ዝርዝር ({words.length})
            </h3>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {words.map((w) => (
                <div
                  key={w.id}
                  className="p-2.5 rounded bg-[#1c1610] border border-[#3d3023] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-300 text-sm">{w.word}</span>
                      <span className="bg-amber-900/60 text-amber-200 text-[10px] px-1.5 py-0.5 rounded border border-amber-700/50">
                        {w.direction === 'across' ? 'አግድም' : 'ቁልቁል'} (r:{w.startRow}, c:{w.startCol})
                      </span>
                    </div>
                    <p className="text-amber-100/70 text-[11px] mt-0.5">{w.clue}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditWord(w)}
                      className="p-1 text-amber-400 hover:bg-amber-800/40 rounded transition"
                      title="አስተካክል"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteWord(w.id)}
                      className="p-1 text-red-400 hover:bg-red-800/40 rounded transition"
                      title="ሰርዝ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Visual Grid Preview & Generated Rack */}
        <div className="md:col-span-6 space-y-4 flex flex-col items-center">
          <div className="w-full card-bg p-4 rounded-xl border flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-amber-800/30 pb-2 mb-3">
              <span className="text-xs font-bold text-amber-400">የሜዳ ቅድመ-ዕይታ (Grid Interactive Preview)</span>
              <span className="text-[11px] text-amber-300/70">
                {selectedCell ? `የተመረጠ: row ${selectedCell.row}, col ${selectedCell.col}` : 'መነሻ ቦታ ለመምረጥ ሰሌዳው ላይ ጠቅ ያድርጉ'}
              </span>
            </div>

            {/* Grid Preview */}
            <div
              className="grid gap-1 board-bg p-3 rounded-xl border shadow-xl"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '1/1'
              }}
            >
              {Array.from({ length: gridSize }).map((_, r) =>
                Array.from({ length: gridSize }).map((_, c) => {
                  const cellKey = `${r}-${c}`;
                  const info = validation.gridMap[cellKey];
                  const isSelected = selectedCell?.row === r && selectedCell?.col === c;

                  return (
                    <button
                      type="button"
                      key={cellKey}
                      onClick={() => handleGridCellClick(r, c)}
                      className={`relative rounded flex items-center justify-center font-bold text-lg select-none aspect-square w-full h-full p-0 border transition ${
                        isSelected
                          ? 'ring-2 ring-amber-400 bg-amber-600/40 border-amber-400'
                          : info
                          ? 'wood-tile border-amber-700/80 text-amber-950'
                          : 'empty-cell border-amber-900/40 hover:bg-amber-800/20'
                      }`}
                    >
                      <span className="text-xs absolute top-0.5 left-0.5 text-amber-500/50 font-mono text-[9px]">
                        {r},{c}
                      </span>
                      {info && <span>{info.char}</span>}
                    </button>
                  );
                })
              )}
            </div>

            {/* Generated Rack Tiles Preview */}
            <div className="w-full mt-4 pt-3 border-t border-amber-800/40">
              <span className="text-xs font-semibold text-amber-300 block mb-2 text-center">
                በራስ-ሰር የተፈጠረ የፊደላት ሳጥን (Auto-generated Rack Tiles - {rackTiles.length})
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {rackTiles.map((char, idx) => (
                  <span
                    key={`${char}-${idx}`}
                    className="w-8 h-8 wood-tile rounded flex items-center justify-center font-bold text-sm text-amber-950 shadow"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Code Output Box */}
          <div className="w-full card-bg p-4 rounded-xl border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                የተፈጠረው የTypeScript ኮድ (Generated Level Code)
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-xs text-amber-300 hover:text-white flex items-center gap-1 bg-amber-800/40 px-2 py-1 rounded cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>ቅዳ</span>
              </button>
            </div>

            <pre className="p-3 bg-[#120e0a] border border-[#382b1f] rounded-lg text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-[160px]">
              {codeOutput}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
