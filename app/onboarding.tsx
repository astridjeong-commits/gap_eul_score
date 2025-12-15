'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, ShieldCheck, ArrowRight, Scale } from 'lucide-react'

// Props 정의에 테마 관련 내용 추가
interface OnboardingProps {
  onEnterClick: () => void;
  isDarkMode: boolean;     // 부모가 알려주는 현재 테마
  toggleTheme: () => void; // 부모에게 요청하는 변경 함수
}

const RANDOM_HOOKS = [
  "사인하기 전,\n딱 3초만 투자하세요.",
  "복잡한 계약,\n점수로 한눈에.",
  "더 이상 억울한 '을'은 없습니다.",
  "당신의 서명이 안전해지는 곳.",
  "계약서 속\n기울어진 운동장을 바로잡습니다.",
  "법률 용어 뒤에 숨은 유불리를\n투명하게 공개합니다.",
  "감(Feeling)이 아닌 데이터로,\n계약의 공정함을 판단하세요."
];

const QA_PAIRS = [
  { q: "\"이 문구,\n나한테 너무 불리한 거 아닐까?\"", a: "걱정 마세요,\n갑을스코어가 꼼꼼하게 뜯어봤습니다." },
  { q: "\"혹시 나도 모르게\n'노예 계약'을 맺고 있진 않나요?\"", a: "AI가 찾아내는 숨겨진 독소조항,\n확실하게 짚어드립니다." },
  { q: "\"전문가 없이\n덜컥 도장 찍어도 괜찮을까요?\"", a: "이제 전문가처럼 분석하고,\n당당하게 계약하세요." },
  { q: "\"이 계약서에서 당신은 파트너인가요,\n아니면 '을'인가요?\"", a: "갑과 을, 그 미묘한 관계의\n균형을 맞춰드립니다." },
  { q: "\"어려운 법률 용어,\n그냥 믿고 넘기시나요?\"", a: "모호한 문장은 명확하게,\n위험한 조항은 쉽게 알려드립니다." }
];

const FIXED_START_MESSAGE = "내 계약서의 안전 점수,\n갑을스코어.";

// props로 isDarkMode, toggleTheme를 받음
export default function OnboardingPage({ onEnterClick, isDarkMode, toggleTheme }: OnboardingProps) {
  
  const [messages, setMessages] = useState<string[]>([])
  const [text, setText] = useState('')
  const [messageIndex, setMessageIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(80)

  useEffect(() => {
    const randomHook = RANDOM_HOOKS[Math.floor(Math.random() * RANDOM_HOOKS.length)];
    const randomQA = QA_PAIRS[Math.floor(Math.random() * QA_PAIRS.length)];
    
    setMessages([
      FIXED_START_MESSAGE,
      randomHook,
      randomQA.q,
      randomQA.a
    ]);
  }, [])

  useEffect(() => {
    if (messages.length === 0) return;

    const handleTyping = () => {
      const currentMessage = messages[messageIndex]
      if (isDeleting) {
        setText(currentMessage.substring(0, text.length - 1))
        setTypingSpeed(30)
      } else {
        setText(currentMessage.substring(0, text.length + 1))
        setTypingSpeed(80)
      }

      if (!isDeleting && text === currentMessage) {
        if (messageIndex === messages.length - 1) return; 
        setTimeout(() => setIsDeleting(true), 2000)
      } else if (isDeleting && text === '') {
        setIsDeleting(false)
        setMessageIndex((prev) => prev + 1)
      }
    }
    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, messageIndex, messages, typingSpeed])

  return (
    // 배경색: 다크모드일 때 bg-background(검정), 라이트일 때 bg-zinc-50(밝은 회색)
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 overflow-hidden">
      <div className="relative w-full h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        
        {/* 테마 토글 버튼 */}
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-50 border border-zinc-200 dark:border-zinc-800"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>

        {/* 배경 장식 */}
        <div className="absolute left-8 sm:left-12 top-1/3 space-y-8 hidden sm:block opacity-50">
          <div className="w-1 h-16 bg-primary rounded animate-pulse"></div>
          <div className="w-1 h-16 bg-primary rounded animate-pulse delay-100"></div>
          <div className="w-1 h-16 bg-primary rounded animate-pulse delay-200"></div>
        </div>

        <div className="max-w-4xl text-center space-y-10 z-10">
          <div className="text-sm sm:text-base tracking-[0.2em] text-primary uppercase font-bold flex items-center justify-center gap-2 animate-fade-in">
            <Scale className="w-4 h-4" />
            Contract Risk Analysis AI
          </div>

          <div className="min-h-[240px] flex items-center justify-center flex-col">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight whitespace-pre-line transition-all duration-300">
              {text}
              <span className="animate-blink ml-1 inline-block w-1 h-10 sm:h-14 bg-primary align-middle"></span>
            </h1>
          </div>

          <div className="animate-fade-in-delay-2">
             <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
               불공정 지수 0%,<br/>안심하고 서명할 수 있도록 돕겠습니다.
             </p>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onEnterClick}
                className="group relative px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <ShieldCheck className="w-6 h-6" />
                <span>무료로 분석 시작하기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-6 opacity-70">
              * 회원가입 없이 바로 확인 가능
            </p>
          </div>
        </div>

        <div className="absolute bottom-10 text-center animate-bounce hidden md:block">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Gap-Eul Score
          </span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-fade-in-delay-2 { opacity: 0; animation: fade-in 1s ease-out 0.5s forwards; }
      `}</style>
    </div>
  )
}