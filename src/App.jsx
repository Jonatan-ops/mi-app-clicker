// src/App.jsx

const { useState, useEffect, useRef } = React;
// We rely on window.lucide if Lucide React is not directly imported in Standalone
// For simplicity in Babel standalone with CDN, we'll use SVGs directly or a simple wrapper.

const MAX_SCORE = 200;

// Reusable SVG Icons
const Icons = {
    Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
    Camera: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
    Undo: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>,
    History: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>,
    List: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>,
    X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
    Trophy: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
};

const Header = ({ onOpenSettings, onOpenHistory, matchCount }) => (
    <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm z-10 border-b border-slate-100 shadow-sm">
        <button onClick={onOpenSettings} className="p-2 text-slate-400 hover:text-domino-600 transition-colors rounded-full hover:bg-slate-50">
            <Icons.Settings />
        </button>
        <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Dominó <span className="text-domino-600">200</span></h1>
            {matchCount > 0 && <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">Partida {matchCount + 1}</span>}
        </div>
        <button onClick={onOpenHistory} className="p-2 text-slate-400 hover:text-domino-600 transition-colors rounded-full hover:bg-slate-50 relative">
            <Icons.History />
            {matchCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-domino-500 rounded-full border-2 border-white"></span>
            )}
        </button>
    </header>
);

const ScoreBoard = ({ teamA, teamB, scoreA, scoreB, activeTeam, setActiveTeam, onOpenRounds }) => {
    // Determine winner early for styling
    const percentA = Math.min((scoreA / MAX_SCORE) * 100, 100);
    const percentB = Math.min((scoreB / MAX_SCORE) * 100, 100);

    return (
        <div className="flex-1 flex flex-col justify-center px-6 py-4 gap-6">
            {/* Team A */}
            <div
                onClick={() => setActiveTeam('A')}
                className={`relative overflow-hidden rounded-3xl p-6 transition-all cursor-pointer ${
                    activeTeam === 'A'
                    ? 'bg-domino-50 border-2 border-domino-400 shadow-md shadow-domino-100/50 scale-[1.02]'
                    : 'bg-white border-2 border-slate-100 shadow-sm hover:border-slate-200'
                }`}
            >
                {/* Progress bar background */}
                <div
                    className="absolute left-0 bottom-0 h-1.5 bg-domino-400 transition-all duration-500 ease-out rounded-r-full"
                    style={{ width: `${percentA}%` }}
                />

                <div className="flex justify-between items-center relative z-10">
                    <h2 className="text-2xl font-bold text-slate-700 truncate pr-4">{teamA.name}</h2>
                    <span className="text-5xl font-black text-slate-800 display-font tracking-tighter w-24 text-right">
                        {scoreA}
                    </span>
                </div>
            </div>

            {/* VS Divider & Rounds Button */}
            <div className="flex items-center justify-center -my-2 relative z-10">
                <button
                    onClick={onOpenRounds}
                    className="bg-white hover:bg-slate-50 px-4 py-1.5 rounded-full text-xs font-bold text-slate-400 hover:text-domino-600 border border-slate-100 shadow-sm tracking-widest flex items-center gap-2 transition-colors group"
                >
                    <span className="text-slate-300 group-hover:text-domino-400">VS</span>
                    <Icons.List />
                </button>
            </div>

            {/* Team B */}
            <div
                onClick={() => setActiveTeam('B')}
                className={`relative overflow-hidden rounded-3xl p-6 transition-all cursor-pointer ${
                    activeTeam === 'B'
                    ? 'bg-domino-50 border-2 border-domino-400 shadow-md shadow-domino-100/50 scale-[1.02]'
                    : 'bg-white border-2 border-slate-100 shadow-sm hover:border-slate-200'
                }`}
            >
                {/* Progress bar background */}
                <div
                    className="absolute left-0 bottom-0 h-1.5 bg-domino-400 transition-all duration-500 ease-out rounded-r-full"
                    style={{ width: `${percentB}%` }}
                />

                <div className="flex justify-between items-center relative z-10">
                    <h2 className="text-2xl font-bold text-slate-700 truncate pr-4">{teamB.name}</h2>
                    <span className="text-5xl font-black text-slate-800 display-font tracking-tighter w-24 text-right">
                        {scoreB}
                    </span>
                </div>
            </div>
        </div>
    );
};

const Keypad = ({ onAddPoints, onUndo, currentInput, setCurrentInput }) => {
    const handleNumberClick = (num) => {
        // Limit input to realistic domino scores (e.g., max 100 per hand typically, but we allow 3 digits up to 200)
        if (currentInput.length < 3) {
            const newVal = currentInput === '0' ? num.toString() : currentInput + num;
            if (parseInt(newVal) <= 200) {
                setCurrentInput(newVal);
            }
        }
    };

    const handleClear = () => {
        setCurrentInput('');
    };

    const handleEnter = () => {
        if (currentInput) {
            onAddPoints(parseInt(currentInput));
            setCurrentInput('');
        }
    };

    const handleCameraClick = () => {
        alert("¡Lectura por cámara próximamente! Por ahora usa el teclado.");
    };

    return (
        <div className="bg-slate-50 border-t border-slate-200/60 pb-8 pt-4 px-4 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20">

            {/* Input Display Area */}
            <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <button
                    onClick={onUndo}
                    className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                    aria-label="Deshacer"
                >
                    <Icons.Undo />
                </button>

                <div className="text-3xl font-bold text-domino-600 display-font tracking-tight flex-1 text-center min-h-[40px]">
                    {currentInput ? `+ ${currentInput}` : <span className="text-slate-300 font-normal">0</span>}
                </div>

                <button
                    onClick={handleCameraClick}
                    className="p-3 text-domino-500 hover:text-domino-600 hover:bg-domino-50 rounded-xl transition-colors"
                    aria-label="Leer fichas (pronto)"
                >
                    <Icons.Camera />
                </button>
            </div>

            {/* Number Grid */}
            <div className="grid grid-cols-3 gap-3 h-56">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleNumberClick(num)}
                        className="keypad-btn bg-white rounded-2xl text-2xl font-semibold text-slate-700 shadow-sm border border-slate-100 flex items-center justify-center active:bg-slate-100 transition-transform"
                    >
                        {num}
                    </button>
                ))}

                {/* Clear / C Button */}
                <button
                    onClick={handleClear}
                    className="keypad-btn bg-slate-200/50 rounded-2xl text-xl font-semibold text-slate-500 shadow-sm border border-slate-100 flex items-center justify-center active:bg-slate-200 transition-transform"
                >
                    C
                </button>

                {/* Zero Button */}
                <button
                    onClick={() => handleNumberClick(0)}
                    className="keypad-btn bg-white rounded-2xl text-2xl font-semibold text-slate-700 shadow-sm border border-slate-100 flex items-center justify-center active:bg-slate-100 transition-transform"
                >
                    0
                </button>

                {/* Enter / Sum Button */}
                <button
                    onClick={handleEnter}
                    className="keypad-btn bg-domino-600 rounded-2xl text-white font-bold text-xl shadow-md shadow-domino-500/30 flex items-center justify-center active:bg-domino-700 transition-transform"
                    disabled={!currentInput}
                    style={{ opacity: currentInput ? 1 : 0.7 }}
                >
                    SUMAR
                </button>
            </div>
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 display-font">{title}</h3>
                    <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                        <Icons.X />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

const SettingsModal = ({ isOpen, onClose, teamA, teamB, updateTeams }) => {
    const [nameA, setNameA] = useState(teamA.name);
    const [nameB, setNameB] = useState(teamB.name);

    useEffect(() => {
        if (isOpen) {
            setNameA(teamA.name);
            setNameB(teamB.name);
        }
    }, [isOpen, teamA, teamB]);

    const handleSave = () => {
        updateTeams(nameA || 'Equipo A', nameB || 'Equipo B');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Configurar Equipos">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Equipo 1</label>
                    <input
                        type="text"
                        value={nameA}
                        onChange={e => setNameA(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-domino-500 focus:border-transparent transition-all"
                        placeholder="Ej. Los Primos"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Equipo 2</label>
                    <input
                        type="text"
                        value={nameB}
                        onChange={e => setNameB(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-domino-500 focus:border-transparent transition-all"
                        placeholder="Ej. Los Tíos"
                    />
                </div>
                <button
                    onClick={handleSave}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
                >
                    Guardar Cambios
                </button>
            </div>
        </Modal>
    );
};

const HistoryModal = ({ isOpen, onClose, history, teamA, teamB }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Historial de Victorias">
            {history.length === 0 ? (
                <div className="text-center py-10 text-slate-400 flex flex-col items-center gap-3">
                    <Icons.Trophy />
                    <p>Aún no hay partidas ganadas.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((match, index) => (
                        <div key={index} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                                        <Icons.Trophy />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{match.winner}</h4>
                                        <p className="text-xs text-slate-500">{new Date(match.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black display-font text-slate-800">{match.scoreA} - {match.scoreB}</div>
                                    <div className="text-xs text-slate-400">Puntaje Final</div>
                                </div>
                            </div>

                            {/* Round summary toggle if rounds exist */}
                            {match.rounds && match.rounds.length > 0 && (
                                <details className="text-sm bg-white rounded-xl border border-slate-100 overflow-hidden group">
                                    <summary className="px-4 py-2 text-slate-500 font-medium cursor-pointer hover:bg-slate-50 list-none flex justify-between items-center">
                                        Ver manos jugadas ({match.rounds.length})
                                        <span className="text-xs opacity-50 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="px-4 py-3 border-t border-slate-100 space-y-2 max-h-40 overflow-y-auto">
                                        {/* Reverse rounds to show chronological order from top to bottom if desired, or keep as is. Our state stores them newest first, so let's reverse for chronological reading here. */}
                                        {[...match.rounds].reverse().map((round, rIdx) => (
                                            <div key={round.id} className="flex justify-between items-center text-xs">
                                                <span className="text-slate-400 w-6">#{rIdx + 1}</span>
                                                <div className="flex-1 flex justify-center">
                                                    <span className={`font-bold ${round.team === 'A' ? 'text-domino-600' : 'text-slate-400'}`}>+{round.team === 'A' ? round.points : '0'}</span>
                                                    <span className="mx-2 text-slate-300">|</span>
                                                    <span className={`font-bold ${round.team === 'B' ? 'text-domino-600' : 'text-slate-400'}`}>+{round.team === 'B' ? round.points : '0'}</span>
                                                </div>
                                                <div className="font-mono text-slate-600 w-16 text-right">
                                                    {round.totalA} - {round.totalB}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
};

const RoundsModal = ({ isOpen, onClose, rounds, teamA, teamB }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Rondas de la partida">
            {!rounds || rounds.length === 0 ? (
                <div className="text-center py-10 text-slate-400 flex flex-col items-center gap-3">
                    <Icons.List />
                    <p>Aún no se han anotado puntos.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-4 pb-2 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span>Ronda</span>
                        <div className="flex gap-4">
                            <span className="w-12 text-center truncate">{teamA.name}</span>
                            <span className="w-12 text-center truncate">{teamB.name}</span>
                        </div>
                        <span className="w-16 text-right">Total</span>
                    </div>

                    <div className="space-y-2">
                        {rounds.map((round, index) => {
                            // Since rounds are stored newest first, the index from bottom is length - index
                            const roundNum = rounds.length - index;
                            const isTeamA = round.team === 'A';

                            return (
                                <div key={round.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">
                                    <span className="text-slate-400 font-medium w-8">#{roundNum}</span>

                                    <div className="flex gap-4 font-bold text-lg display-font">
                                        <span className={`w-12 text-center ${isTeamA ? 'text-domino-600' : 'text-slate-300 font-normal'}`}>
                                            {isTeamA ? `+${round.points}` : '-'}
                                        </span>
                                        <span className={`w-12 text-center ${!isTeamA ? 'text-domino-600' : 'text-slate-300 font-normal'}`}>
                                            {!isTeamA ? `+${round.points}` : '-'}
                                        </span>
                                    </div>

                                    <div className="font-mono font-bold text-slate-700 w-16 text-right bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                                        {round.totalA}<span className="text-slate-300 font-normal mx-0.5">-</span>{round.totalB}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </Modal>
    );
};

const VictoryModal = ({ winner, isOpen, onReset, onChangeTeams }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
                {/* Confetti effect placeholder using CSS gradient backgrounds */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #fde68a 0%, transparent 50%)', backgroundSize: '200% 200%', backgroundPosition: '50% 50%' }}></div>

                <div className="w-20 h-20 mx-auto bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-amber-50">
                    <Icons.Trophy />
                </div>

                <h2 className="text-3xl font-black text-slate-800 display-font mb-2">¡Victoria!</h2>
                <p className="text-lg text-slate-600 mb-8 font-medium">
                    <span className="text-domino-600 font-bold">{winner}</span> ha alcanzado los {MAX_SCORE} puntos.
                </p>

                <div className="space-y-3 relative z-10">
                    <button
                        onClick={onReset}
                        className="w-full bg-domino-600 hover:bg-domino-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-domino-600/30 transition-all active:scale-[0.98]"
                    >
                        Jugar Revancha
                    </button>
                    <button
                        onClick={onChangeTeams}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-4 rounded-xl transition-all active:scale-[0.98]"
                    >
                        Cambiar Equipos (Rotar)
                    </button>
                </div>
            </div>
        </div>
    );
};

// Make App globally available for Babel
window.App = () => {
    // Default initial state
    const initialState = {
        teamA: { name: 'Nosotros', score: 0 },
        teamB: { name: 'Ellos', score: 0 },
        history: [], // Overall match history
        currentRounds: [], // Tracks points added in the current match: [{ team: 'A', points: 25, totalA: 25, totalB: 0 }]
        activeTeam: 'A' // 'A' or 'B'
    };

    const [state, setState] = useState(() => {
        try {
            const saved = localStorage.getItem('domino200_state');
            return saved ? JSON.parse(saved) : initialState;
        } catch (e) {
            return initialState;
        }
    });

    const [currentInput, setCurrentInput] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isRoundsOpen, setIsRoundsOpen] = useState(false);
    const [victoryData, setVictoryData] = useState(null); // { winner: string }

    // Save to local storage whenever state changes
    useEffect(() => {
        localStorage.setItem('domino200_state', JSON.stringify(state));

        // Check victory condition
        if (state.teamA.score >= MAX_SCORE && !victoryData) {
            handleVictory(state.teamA.name);
        } else if (state.teamB.score >= MAX_SCORE && !victoryData) {
            handleVictory(state.teamB.name);
        }
    }, [state]);

    const handleVictory = (winnerName) => {
        setVictoryData({ winner: winnerName });

        // Add to history
        const newMatch = {
            winner: winnerName,
            scoreA: state.teamA.score,
            scoreB: state.teamB.score,
            date: new Date().toISOString(),
            rounds: state.currentRounds || [] // Save the breakdown
        };

        setState(prev => ({
            ...prev,
            history: [newMatch, ...prev.history].slice(0, 50) // Keep last 50 matches
        }));
    };

    const handleAddPoints = (points) => {
        if (points <= 0) return;

        setState(prev => {
            const teamKey = prev.activeTeam === 'A' ? 'teamA' : 'teamB';
            const newScoreA = prev.activeTeam === 'A' ? prev.teamA.score + points : prev.teamA.score;
            const newScoreB = prev.activeTeam === 'B' ? prev.teamB.score + points : prev.teamB.score;

            const newRound = {
                id: Date.now(),
                team: prev.activeTeam,
                points: points,
                totalA: newScoreA,
                totalB: newScoreB
            };

            return {
                ...prev,
                [teamKey]: {
                    ...prev[teamKey],
                    score: prev[teamKey].score + points
                },
                currentRounds: [newRound, ...(prev.currentRounds || [])]
            };
        });
    };

    const handleUndo = () => {
        // Basic undo for last added points is complex without full history array.
        // For simplicity in MVP, we just allow manual deduction if they make a mistake,
        // but we'll implement a simple "reset current input" or "deduct 10" if long pressed maybe?
        // Actually, let's make Undo deduct the current input from active team if input exists,
        // otherwise it does nothing (since we don't have an action stack yet).
        alert("Deshacer requiere historial de acciones. Para corregir, puedes editar el estado reiniciando.");
        // A better MVP approach: Add an action stack to state if needed,
        // but let's keep it simple: just clearing the input is usually enough for typos.
        setCurrentInput('');
    };

    const updateTeams = (nameA, nameB) => {
        setState(prev => ({
            ...prev,
            teamA: { ...prev.teamA, name: nameA },
            teamB: { ...prev.teamB, name: nameB }
        }));
    };

    const resetScores = () => {
        setState(prev => ({
            ...prev,
            teamA: { ...prev.teamA, score: 0 },
            teamB: { ...prev.teamB, score: 0 },
            currentRounds: [],
            activeTeam: 'A'
        }));
        setVictoryData(null);
        setCurrentInput('');
    };

    const handleChangeTeams = () => {
        resetScores();
        setIsSettingsOpen(true);
    };

    return (
        <>
            <Header
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenHistory={() => setIsHistoryOpen(true)}
                matchCount={state.history.length}
            />

            <ScoreBoard
                teamA={state.teamA}
                teamB={state.teamB}
                scoreA={state.teamA.score}
                scoreB={state.teamB.score}
                activeTeam={state.activeTeam}
                setActiveTeam={(t) => setState(prev => ({ ...prev, activeTeam: t }))}
                onOpenRounds={() => setIsRoundsOpen(true)}
            />

            <Keypad
                onAddPoints={handleAddPoints}
                onUndo={() => setCurrentInput('')} // Undo clears input for now
                currentInput={currentInput}
                setCurrentInput={setCurrentInput}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                teamA={state.teamA}
                teamB={state.teamB}
                updateTeams={updateTeams}
            />

            <HistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={state.history}
                teamA={state.teamA}
                teamB={state.teamB}
            />

            <RoundsModal
                isOpen={isRoundsOpen}
                onClose={() => setIsRoundsOpen(false)}
                rounds={state.currentRounds}
                teamA={state.teamA}
                teamB={state.teamB}
            />

            <VictoryModal
                isOpen={!!victoryData}
                winner={victoryData?.winner}
                onReset={resetScores}
                onChangeTeams={handleChangeTeams}
            />
        </>
    );
};
