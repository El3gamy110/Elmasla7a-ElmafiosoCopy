import React, { useState } from 'react';
import { SCENARIOS_DATABASE } from './assets/data';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('setup'); // setup, roles, game, end
  const [playerCount, setPlayerCount] = useState('');
  const [names, setNames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showCard, setShowCard] = useState(false);
  
  const [scenario, setScenario] = useState({});
  const [shownEvidences, setShownEvidences] = useState([]);
  const [isShowdown, setIsShowdown] = useState(false);
  
  // المودال لتنبيهات اللعبة
  const [modal, setModal] = useState({ show: false, title: '', msg: '' });

  const handleCountChange = (e) => {
    const count = parseInt(e.target.value);
    setPlayerCount(count);
    setNames(Array(count).fill(''));
  };

  const handleNameChange = (idx, value) => {
    const updated = [...names];
    updated[idx] = value;
    setNames(updated);
  };

  // دالة بدء اللعبة وتوزيع الأدوار والسيناريو
  const initGame = () => {
    const finalNames = names.map((n, i) => n.trim() || `لاعب ${i + 1}`);
    if (finalNames.length < 4) return;

    // سحب سيناريو عشوائي كامل ومحبوك
    const baseScenario = SCENARIOS_DATABASE[Math.floor(Math.random() * SCENARIOS_DATABASE.length)];
    const shuffledEv = [...baseScenario.evidences].sort(() => Math.random() - 0.5);

    setScenario({
      text: `${baseScenario.place}، تم العثور على ${baseScenario.victim} مقتولاً. الدافع المتوقع هو ${baseScenario.motive}.`,
      ev: shuffledEv,
      victim: baseScenario.victim,
      motive: baseScenario.motive
    });

    // تحديد المافيا بناءً على عدد اللاعبين
    const mCount = finalNames.length <= 5 ? 1 : 2;
    const mIndices = Array.from({ length: finalNames.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, mCount);

    // سحب الوظائف المربوطة بالسيناريو المختار حصرياً
    const jobsPool = [...baseScenario.jobs].sort(() => Math.random() - 0.5);

    const generatedPlayers = finalNames.map((name, i) => {
      const jobData = jobsPool[i % jobsPool.length];
      return {
        id: i,
        name,
        role: mIndices.includes(i) ? 'المافيا' : 'بريء',
        job: jobData.j,
        story: jobData.s,
        e: jobData.d,
        alive: true
      };
    });

    setPlayers(generatedPlayers);
    setShownEvidences([shuffledEv[0]]);
    setCurrentIdx(0);
    setShowCard(false);
    setIsShowdown(false);
    setScreen('roles');
  };

  const nextPlayer = () => {
    if (currentIdx + 1 < players.length) {
      setCurrentIdx(currentIdx + 1);
      setShowCard(false);
    } else {
      setScreen('game');
    }
  };

  // تصويت واستهداف المشتبه به ونظام جولة الحسم
  const vote = (id) => {
    const target = players.find(p => p.id === id);
    const updatedPlayers = players.map(p => p.id === id ? { ...p, alive: false } : p);
    setPlayers(updatedPlayers);

    const currentMafiaAlive = updatedPlayers.filter(p => p.role === 'المافيا' && p.alive);
    const currentInnocentAlive = updatedPlayers.filter(p => p.role === 'بريء' && p.alive);

    if (isShowdown) {
      finish(target.role === 'المافيا' ? 'بريء' : 'المافيا', updatedPlayers);
      return;
    }

    if (target.role === 'المافيا') {
      if (currentMafiaAlive.length === 0) {
        finish('بريء', updatedPlayers);
      } else {
        setModal({ show: true, title: 'جبتوه! 🎯', msg: 'ده مافيا فعلاً! بس لسه فيه واحد تاني مستخبي وسطكم.' });
      }
    } else {
      // إذا تم اتهام بريء، نتحقق من تفعيل جولة الحسم (1 ضد 1)
      if (currentInnocentAlive.length === 1 && currentMafiaAlive.length === 1) {
        setIsShowdown(true);
        // عرض الدليل الأخير في جولة الحسم كدعم إضافي
        setShownEvidences([...shownEvidences, scenario.ev[4] || scenario.ev[scenario.ev.length - 1]]);
        setModal({ show: true, title: 'بريء! ❌', msg: 'بدأت جولة الحسم والمواجهة النهائية (1 ضد 1)! ركزوا في الدليل الأخير.' });
      } else if (currentInnocentAlive.length < currentMafiaAlive.length) {
        finish('المافيا', updatedPlayers);
      } else {
        if (shownEvidences.length < 3) {
          setShownEvidences([...shownEvidences, scenario.ev[shownEvidences.length]]);
        }
        setModal({ show: true, title: 'مظلوم! 😔', msg: 'للأسف ده بريء.. تم العثور على دليل جنائي جديد ليوجه التحقيق.' });
      }
    }
  };

  const finish = (winner) => {
    setScreen('end');
    setScenario(prev => ({ ...prev, winner }));
  };

  const mafias = players.filter(p => p.role === 'المافيا');

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Cairo'] relative overflow-x-hidden p-4 select-none"
         style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #050505 100%)' }}>
      
      {/* مودال التنبيهات والأدلة */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-[#111] p-6 rounded-[25px] border-2 border-[#00f2ff] w-[280px] text-center shadow-[0_0_20px_#00f2ff]">
            <h2 className="text-[#f3ff00] font-black text-xl">{modal.title}</h2>
            <p className="my-4 text-xs text-gray-300 leading-relaxed">{modal.msg}</p>
            <button 
              onClick={() => setModal({ show: false, title: '', msg: '' })}
              className="bg-[#00f2ff] text-black px-6 py-2 rounded-xl text-sm font-black tracking-wide shadow-[0_4px_10px_rgba(0,242,255,0.4)]"
            >
              تمام يا كبير
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-[500px] mx-auto py-5">
        
        {/* 1. شاشة الإعداد Setup */}
        {screen === 'setup' && (
          <div className="space-y-4">
            <h1 className="text-[4rem] font-black text-[#f3ff00] text-center tracking-tight pt-6"
                style={{ textShadow: '3px 3px 0 #ff007f, -2px -2px 0 #00f2ff' }}>
              🔎 المصلحه  
            </h1>
            <span className="text-[#00f2ff] text-center font-bold text-2xl tracking-[4px] block">
              لعبة الذكاء والدم البارد
            </span>
            <span className="text-[#00f2ff] text-center font-bold text-xs tracking-[4px] block mb-8">
              "مقتبسه من برنامج اليوتيوب الشهير "المافيوسو
            </span>
            
            <div className="relative">
              <select 
                value={playerCount}
                onChange={handleCountChange}
                className="w-full p-[18px] rounded-[20px] border-2 border-[#ff007f] bg-[#111] text-white text-lg font-black text-center appearance-none cursor-pointer outline-none transition-all shadow-[5px_5px_0_#00f2ff]"
              >
                <option value="" disabled>من كام لاعب؟</option>
                {[4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} لاعبين</option>
                ))}
              </select>
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#00f2ff] pointer-events-none text-xs">▼</div>
            </div>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
              {names.map((name, idx) => (
                <input 
                  key={idx}
                  type="text" 
                  value={name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  placeholder={`اسم اللاعب ${idx + 1}`}
                  className="w-full p-[16px] my-[5px] rounded-[15px] border border-[#333] bg-white/5 text-center text-lg outline-none focus:border-[#00f2ff] transition-all"
                />
              ))}
            </div>

            {playerCount && (
              <button 
                onClick={initGame}
                className="w-full p-[18px] mt-4 rounded-[15px] text-xl font-black bg-gradient-to-r from-[#ff007f] to-[#ff00ff] text-white shadow-[0_4px_15px_rgba(255,0,127,0.4)] active:scale-95 transition-transform"
              >
                توزيع الأدوار 🃏
              </button>
            )}
          </div>
        )}

        {/* 2. شاشة عرض الأدوار Roles */}
        {screen === 'roles' && players[currentIdx] && (
          <div className="space-y-4 text-center py-6">
            <h2 className="text-[#00f2ff] font-black text-2xl mb-2">دور اللاعب: {players[currentIdx].name}</h2>
            <p className="text-gray-400 text-xs">ادي الموبايل لصاحب الاسم واقفلوا النور 🤫</p>
            
            <div 
              onClick={() => setShowCard(true)}
              className="bg-[#121212] border-2 border-[#f3ff00] py-[60px] px-5 rounded-[30px] my-[30px] shadow-[8px_8px_0_#00f2ff] cursor-pointer"
            >
              {!showCard ? (
                <div className="font-black text-xl tracking-wider text-gray-300">اِلمس الكارت لمعاينة دورك 🔒</div>
              ) : (
                <div className="space-y-3">
                  <h2 className="text-[#ff007f] text-[2.8rem] font-black tracking-wide">{players[currentIdx].role}</h2>
                  <h3 className="text-[#f3ff00] font-bold text-lg">التخصص: {players[currentIdx].job}</h3>
                  <p className="text-gray-300 text-sm max-w-[320px] mx-auto leading-relaxed">{players[currentIdx].story}</p>
                </div>
              )}
            </div>

            <button 
              onClick={nextPlayer}
              className="w-full p-[18px] rounded-[15px] text-xl font-black bg-gradient-to-r from-[#ff007f] to-[#ff00ff] text-white shadow-[0_4px_15px_rgba(255,0,127,0.4)]"
            >
              فهمت البصمة ⮕
            </button>
          </div>
        )}

        {/* 3. شاشة اللعبة الأساسية Game */}
        {screen === 'game' && (
          <div className="space-y-4">
            {isShowdown && (
              <div className="bg-[#f3ff00] text-black p-3 text-center font-black rounded-xl my-2 shadow-[0_0_20px_#f3ff00] text-sm animate-pulse">
                ⚡ جولة الحسم: المواجهة الأخيرة 1 ضد 1 ⚡
              </div>
            )}
            
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[#f3ff00] font-black text-base">📍 بلاغ جريمة القتل:</h3>
              <span className="bg-[#ff007f] text-white px-3 py-1 rounded-lg text-xs font-black">
                باقي مافيا: {players.filter(p => p.role === 'المافيا' && p.alive).length}
              </span>
            </div>

            <div className="bg-white text-black p-5 rounded-[20px] border-r-[12px] border-[#ff007f] font-bold text-sm leading-[1.7] shadow-lg">
              {scenario.text}
            </div>

            <div className="my-4">
              <h4 className="text-[#00f2ff] font-black text-sm mb-2">🔍 الأدلة الجنائية المكتشفة:</h4>
              <div className="space-y-2">
                {shownEvidences.map((ev, idx) => (
                  <div key={idx} className="bg-[#00f2ff]/10 p-[14px] rounded-[15px] border-r-4 border-[#00f2ff] text-[0.85rem] text-gray-200 leading-relaxed">
                    <b className="text-white block mb-0.5">دليل رقم {idx + 1}:</b> {ev}
                  </div>
                ))}
              </div>
            </div>

            <h4 className="text-gray-400 font-bold text-xs mt-4 mb-1">اصدر حكمك واتهم المشتبه به:</h4>
            <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1">
              {players.filter(p => p.alive).map(p => (
                <div key={p.id} className="bg-[#161616] flex justify-between items-center p-[14px] rounded-[18px] border border-[#222]">
                  <div>
                    <b className="text-white text-base block">{p.name}</b>
                    <div className="text-[#00f2ff] text-xs font-bold">التخصص الجنائي: {p.job}</div>
                  </div>
                  <button 
                    onClick={() => vote(p.id)}
                    className="bg-[#00f2ff] text-black px-4 py-2 text-xs font-black rounded-xl active:scale-95 transition-transform"
                  >
                    اتهام ⚖️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. شاشة النهاية والـ Recap المفصل */}
        {screen === 'end' && (
          <div className="space-y-5">
            <h1 className={`text-4xl font-black text-center pt-4 tracking-tight ${scenario.winner === 'بريء' ? 'text-[#00f2ff]' : 'text-[#ff007f]'}`}>
              {scenario.winner === 'بريء' ? 'العدالة انتصرت! ✅' : 'المافيا كسبوا المصلحة! ❌'}
            </h1>
            
            <div className="bg-[#111] p-5 rounded-[25px] border-2 border-[#f3ff00] text-right text-sm leading-[1.8] max-h-[52vh] overflow-y-auto space-y-4 shadow-xl">
              <span className="text-[#00f2ff] font-black text-base block border-b border-[#222] pb-1">🕵️ الحكاية من الطقاطق للسلامو عليكم:</span>
              <p className="text-gray-200 text-xs">
                القصة بدأت لما اجتمع <span className="text-[#ff007f] font-black">{mafias.map(m => m.name).join(' و ')}</span> في الخفاء للتخلص التام من <b className="text-[#f3ff00]">{scenario.victim}</b>. 
                الشرارة الأساسية انطلقت من عند <b>{mafias[0]?.name}</b> بسبب دوافعه السرية: {mafias[0]?.story}.
              </p>

              <span className="text-[#00f2ff] font-black text-base block border-b border-[#222] pb-1">🪓 تفاصيل وخطة التنفيذ:</span>
              <p className="text-gray-200 text-xs">
                الخطة كانت محبوكة، فباعتباره شغال كـ <span className="text-[#ff007f] font-black">{mafias[0]?.job}</span>، استغل مهاراته الحرفية في إنه: {mafias[0]?.e}. 
                وده اللي فتح الخيط للمحققين عشان يلاقوا الدليل رقم 1 وهو: <i>"{scenario.ev[0]}"</i>.
              </p>

              {mafias[1] && (
                <>
                  <span className="text-[#00f2ff] font-black text-base block border-b border-[#222] pb-1">🤝 دور الشريك التاني:</span>
                  <p className="text-gray-200 text-xs">
                    أما الشريك التاني <b>{mafias[1].name}</b> فدوره كـ <span className="text-[#ff007f] font-black">{mafias[1].job}</span> كان حاسم ومكمل للجريمة لأن قصته {mafias[1].story}، وقام بـ {mafias[1].e}.
                  </p>
                </>
              )}

              <span className="text-[#00f2ff] font-black text-base block border-b border-[#222] pb-1">💀 الدافع الحقيقي الكلي:</span>
              <p className="text-gray-200 text-xs">الهدف النهائي والدافع الكبير من وراء المصلحة دي كان {scenario.motive}.. المصلحة خلصت والشرطة قفلت المحضر.</p>
            </div>

            <button 
              onClick={() => setScreen('setup')}
              className="w-full p-[18px] rounded-[15px] text-xl font-black bg-[#f3ff00] text-black shadow-[0_4px_15px_rgba(243,255,0,0.3)] active:scale-95 transition-transform"
            >
              مصلحة تانية؟ 🔄
            </button>
          </div>
        )}

      </div>
    </div>
  );
}