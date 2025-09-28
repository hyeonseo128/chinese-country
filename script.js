import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Check, X, RotateCcw, Play } from 'lucide-react';

const ChinesePracticePage = () => {
  const countryData = [
    { korean: '한국', chinese: '韩国', pinyin: 'hán guó', meaning: '한국' },
    { korean: '일본', chinese: '日本', pinyin: 'rì běn', meaning: '일본' },
    { korean: '중국', chinese: '中国', pinyin: 'zhōng guó', meaning: '중국' },
    { korean: '인도', chinese: '印度', pinyin: 'yìn dù', meaning: '인도' },
    { korean: '싱가포르', chinese: '新加坡', pinyin: 'xīn jiā pō', meaning: '싱가포르' },
    { korean: '미국', chinese: '美国', pinyin: 'měi guó', meaning: '미국' },
    { korean: '캐나다', chinese: '加拿大', pinyin: 'jiā ná dà', meaning: '캐나다' },
    { korean: '브라질', chinese: '巴西', pinyin: 'bā xī', meaning: '브라질' },
    { korean: '아르헨티나', chinese: '阿根廷', pinyin: 'ā gēn tíng', meaning: '아르헨티나' },
    { korean: '칠레', chinese: '智利', pinyin: 'zhì lì', meaning: '칠레' },
    { korean: '오스트레일리아', chinese: '澳大利亚', pinyin: 'ào dà lì yà', meaning: '오스트레일리아' },
    { korean: '뉴질랜드', chinese: '新西兰', pinyin: 'xīn xī lán', meaning: '뉴질랜드' },
    { korean: '영국', chinese: '英国', pinyin: 'yīng guó', meaning: '영국' },
    { korean: '프랑스', chinese: '法国', pinyin: 'fǎ guó', meaning: '프랑스' },
    { korean: '스페인', chinese: '西班牙', pinyin: 'xī bān yá', meaning: '스페인' },
    { korean: '러시아', chinese: '俄罗斯', pinyin: 'é luó sī', meaning: '러시아' },
    { korean: '독일', chinese: '德国', pinyin: 'dé guó', meaning: '독일' },
    { korean: '이탈리아', chinese: '意大利', pinyin: 'yì dà lì', meaning: '이탈리아' },
    { korean: '스웨덴', chinese: '瑞典', pinyin: 'ruì diǎn', meaning: '스웨덴' },
    { korean: '벨기에', chinese: '比利时', pinyin: 'bǐ lì shí', meaning: '벨기에' },
    { korean: '이집트', chinese: '埃及', pinyin: 'āi jí', meaning: '이집트' },
    { korean: '남아프리카공화국', chinese: '南非', pinyin: 'nán fēi', meaning: '남아프리카공화국' },
    { korean: '케냐', chinese: '肯尼亚', pinyin: 'kěn ní yà', meaning: '케냐' },
    { korean: '나이지리아', chinese: '尼日利亚', pinyin: 'ní rì lì yà', meaning: '나이지리아' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const [usedIndices, setUsedIndices] = useState(new Set());
  const [userPinyin, setUserPinyin] = useState('');
  const [userMeaning, setUserMeaning] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [round, setRound] = useState(1);

  // 셔플 함수
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 초기 셔플 설정
  useEffect(() => {
    const indices = Array.from({ length: countryData.length }, (_, i) => i);
    setShuffledIndices(shuffleArray(indices));
  }, []);

  // 현재 문제
  const currentWord = shuffledIndices.length > 0 ? countryData[shuffledIndices[currentIndex]] : countryData[0];

  // TTS 함수
  const speakChinese = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentWord.chinese);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentWord]);

  // 성조 매핑
  const toneMap = {
    'a': ['ā', 'á', 'ǎ', 'à'],
    'e': ['ē', 'é', 'ě', 'è'],
    'i': ['ī', 'í', 'ǐ', 'ì'],
    'o': ['ō', 'ó', 'ǒ', 'ò'],
    'u': ['ū', 'ú', 'ǔ', 'ù'],
    'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
    'v': ['ǖ', 'ǘ', 'ǚ', 'ǜ'] // v는 ü의 대체 표기
  };

  // 성조 추가
  const addTone = (tone) => {
    if (!userPinyin) return;
    
    const lastChar = userPinyin.slice(-1).toLowerCase();
    if (toneMap[lastChar]) {
      const newPinyin = userPinyin.slice(0, -1) + toneMap[lastChar][tone - 1];
      setUserPinyin(newPinyin);
    }
  };

  // 마지막 문자에서 성조 제거
  const removeTone = () => {
    if (!userPinyin) return;
    
    const lastChar = userPinyin.slice(-1);
    // 성조가 있는 문자를 원래 문자로 변환
    const toneChars = 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ';
    const baseChars = 'aaaaeeeeiiiioooouuuuüüüü';
    
    const toneIndex = toneChars.indexOf(lastChar);
    if (toneIndex !== -1) {
      const baseChar = baseChars[toneIndex];
      setUserPinyin(userPinyin.slice(0, -1) + baseChar);
    }
  };

  // 정답 확인
  const checkAnswer = () => {
    const correctPinyin = currentWord.pinyin.toLowerCase().replace(/\s+/g, '');
    const correctMeaning = currentWord.meaning;

    const userPinyinClean = userPinyin.toLowerCase().replace(/\s+/g, '');
    const userMeaningClean = userMeaning.trim();

    const pinyinCorrect = correctPinyin === userPinyinClean;
    const meaningCorrect = correctMeaning === userMeaningClean;

    const allCorrect = pinyinCorrect && meaningCorrect;
    
    setIsCorrect(allCorrect);
    setShowResult(true);
    setScore(prev => ({
      correct: prev.correct + (allCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  // 다음 문제
  const nextQuestion = () => {
    const newUsedIndices = new Set([...usedIndices, shuffledIndices[currentIndex]]);
    
    if (newUsedIndices.size === countryData.length) {
      // 한 바퀴 완료, 새로운 라운드 시작
      const indices = Array.from({ length: countryData.length }, (_, i) => i);
      setShuffledIndices(shuffleArray(indices));
      setCurrentIndex(0);
      setUsedIndices(new Set());
      setRound(prev => prev + 1);
    } else {
      setUsedIndices(newUsedIndices);
      setCurrentIndex(prev => prev + 1);
    }

    // 입력 초기화
    setUserPinyin('');
    setUserMeaning('');
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-red-600 mb-2">🇨🇳 중국어 발음 연습</h1>
            <p className="text-gray-600">국가명 한어병음과 뜻을 맞춰보세요!</p>
          </div>

          <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              라운드 {round} • 진행률: {usedIndices.size}/{countryData.length}
            </div>
            <div className="text-sm">
              정답률: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}% 
              ({score.correct}/{score.total})
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="mb-4">
              <button
                onClick={speakChinese}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold flex items-center gap-3 mx-auto transition-colors"
              >
                <Volume2 size={24} />
                발음 듣기
              </button>
            </div>
            <p className="text-gray-500 text-sm">버튼을 클릭하여 중국어 발음을 들어보세요</p>
          </div>

          <div className="space-y-6">
            {/* 한어병음 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                한어병음 (로마자, 띄어쓰기 상관없음)
              </label>
              <input
                type="text"
                value={userPinyin}
                onChange={(e) => setUserPinyin(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="예: hán guó 또는 hánguó"
                disabled={showResult}
              />
            </div>

            {/* 성조 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성조 추가 (마지막 알파벳에 성조 표시)
              </label>
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4].map(tone => (
                  <button
                    key={tone}
                    onClick={() => addTone(tone)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors"
                    disabled={showResult}
                  >
                    {tone}성 {['ˉ', 'ˊ', 'ˇ', 'ˋ'][tone - 1]}
                  </button>
                ))}
                <button
                  onClick={removeTone}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  disabled={showResult}
                >
                  성조 제거
                </button>
              </div>
              <div className="text-sm text-gray-600">
                예시: "han guo" 또는 "hanguo" 입력 후 각각 성조 버튼 클릭 → "hán guó" 또는 "hánguó"
              </div>
            </div>

            {/* 뜻 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                뜻 (한국어)
              </label>
              <input
                type="text"
                value={userMeaning}
                onChange={(e) => setUserMeaning(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="예: 한국"
                disabled={showResult}
              />
            </div>

            {/* 결과 표시 */}
            {showResult && (
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {isCorrect ? (
                    <Check className="text-green-600" size={24} />
                  ) : (
                    <X className="text-red-600" size={24} />
                  )}
                  <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? '정답입니다!' : '틀렸습니다!'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>정답:</strong>
                    <div className="ml-4">
                      <div>한자: {currentWord.chinese}</div>
                      <div>병음: {currentWord.pinyin}</div>
                      <div>뜻: {currentWord.meaning}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 버튼들 */}
            <div className="flex gap-3">
              {!showResult ? (
                <button
                  onClick={checkAnswer}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition-colors"
                  disabled={!userPinyin || !userMeaning}
                >
                  정답 확인
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition-colors"
                >
                  다음 문제
                </button>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="px-6 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          💡 팁: 병음을 입력한 후 성조 버튼을 눌러 마지막 글자에 성조를 추가하세요. 띄어쓰기는 자유롭게 하세요.
        </div>
      </div>
    </div>
  );
};

export default ChinesePracticePage;