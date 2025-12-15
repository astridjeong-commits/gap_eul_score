"use client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

import { useState, useRef } from "react"
import { Upload, FileText, Shield, Scale, CheckCircle, Moon, Sun, Target, FileType, Loader2 } from "lucide-react" 

// ⭐ Props 타입 정의 (export)
export interface BridgeProps {
  onAnalyzeComplete?: (text: string, result: any, fileName: string) => void;  // ⭐ fileName 추가
}

// --- UI 컴포넌트 (Button) ---
const Button = ({ className, variant = "default", size = "default", children, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
  }
  const sizes = { 
    default: "h-9 px-4 py-2", 
    sm: "h-8 rounded-md px-3 text-xs", 
    lg: "h-10 rounded-md px-8", 
    icon: "h-9 w-9" 
  }
  return (
    <button 
      className={`${baseStyles} ${variants[variant as keyof typeof variants] || variants.default} ${sizes[size as keyof typeof sizes] || sizes.default} ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}

// --- UI 컴포넌트 (Badge) ---
const Badge = ({ className, variant = "default", children, ...props }: any) => {
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "text-foreground"
  }
  return (
    <div 
      className={`${baseStyles} ${variants[variant as keyof typeof variants] || variants.default} ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}

// --- 메인 컴포넌트 ---
export default function GapEulBridge({ onAnalyzeComplete }: BridgeProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  // ⭐ 파일 업로드 + Claude 분석
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const fileName = files[0].name;  // ⭐ 파일명 추출

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      // 1단계: 파일 업로드 및 텍스트 추출
      setAnalysisStep("파일을 업로드하고 있습니다...");
      const uploadResponse = await fetch('${API_URL}/upload', {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("파일 업로드 실패");
      }

      const uploadData = await uploadResponse.json();
      const extractedText = uploadData.text;

      console.log("✅ 텍스트 추출 완료:", extractedText.length, "자");

      // 2단계: Claude AI 분석
      setAnalysisStep("AI가 계약서를 분석하고 있습니다...");
      const analysisResponse = await fetch('${API_URL}/analyze/with-mcp', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract_text: extractedText }),
      });

      if (!analysisResponse.ok) {
        throw new Error("AI 분석 실패");
      }

      const analysisResult = await analysisResponse.json();
      console.log("✅ AI 분석 완료:", analysisResult);

      // 3단계: 대시보드로 이동 (텍스트 + 분석 결과)
      if (onAnalyzeComplete) {
        onAnalyzeComplete(extractedText, analysisResult, fileName);  // ⭐ fileName 전달
      }

    } catch (error) {
      console.error("❌ 오류:", error);
      alert(`오류 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}\n\n서버가 실행 중인지 확인하세요.`);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep("");
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }

  return (
    <div className={`${theme} min-h-screen flex flex-col bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30`}>
      
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2">
          <Scale className="h-6 w-6 text-cyan-500 fill-cyan-500/10" /> 
          <span className="text-lg font-bold tracking-tight">Gap-Eul Score</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          className="rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-5xl mx-auto w-full z-10 space-y-12">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
            <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-none text-xs px-3 py-1 rounded-full">
              AI Powered Analysis
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-200 via-cyan-200 to-white bg-clip-text text-transparent pb-2">
            숫자로 확인하는 계약의 중요성
          </h1>
          <p className="text-xl text-slate-400 font-light">계약서에 사인하기 전, 확인해보세요</p>
        </div>

        {/* Upload Section */}
        <div className={`w-full max-w-3xl transition-all duration-300 ease-in-out transform ${isDragging ? 'scale-[1.02]' : ''}`}>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isAnalyzing && fileInputRef.current?.click()}
            className={`relative group cursor-pointer bg-slate-900/50 backdrop-blur-sm border-2 border-dashed rounded-3xl h-64 flex flex-col items-center justify-center transition-all duration-300 ${
              isDragging 
                ? 'border-cyan-500 bg-slate-800/80 ring-4 ring-cyan-500/10' 
                : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.txt,.docx" 
              onChange={(e) => handleFileUpload(e.target.files)} 
            />
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center space-y-4 z-20">
                <Loader2 className="h-12 w-12 text-cyan-500 animate-spin" />
                <p className="text-lg font-semibold text-cyan-400 animate-pulse">{analysisStep}</p>
                <p className="text-sm text-slate-500">잠시만 기다려주세요...</p>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center space-y-4 p-6 text-center">
                <div className={`p-4 rounded-full bg-slate-800 transition-all duration-300 ${
                  isDragging 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'text-slate-400 group-hover:text-cyan-400 group-hover:scale-110'
                }`}>
                  <Upload className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-200">파일 업로드 또는 드래그</h3>
                  <p className="text-sm text-slate-500">PDF, TXT, DOCX 파일을 지원합니다</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge variant="secondary" className="bg-slate-800 text-slate-400">
                    <FileType className="w-3 h-3 mr-1"/> PDF
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-800 text-slate-400">
                    <FileText className="w-3 h-3 mr-1"/> TXT
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-800 text-slate-400">
                    <FileText className="w-3 h-3 mr-1"/> DOCX
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-red-400 mx-auto" />} 
            title="독소조항 탐지" 
            description={<>나에게 불리한 5가지 위험 요소를 <br /> AI가 찾아냅니다.</>} 
            color="hover:border-red-500/30" 
          />
          <FeatureCard 
            icon={<Target className="h-6 w-6 text-cyan-400 mx-auto" />} 
            title="갑을 관계 점수" 
            description={<>권리와 의무의 균형이 맞는지 <br /> 점수로 알려드립니다.</>} 
            color="hover:border-cyan-500/30" 
          />
          <FeatureCard 
            icon={<CheckCircle className="h-6 w-6 text-green-400 mx-auto" />} 
            title="협상 가이드" 
            description={<>어떻게 수정해달라고 말해야 할지 <br /> 알려드립니다.</>} 
            color="hover:border-green-500/30" 
          />
        </div>
      </main>

      <footer className="w-full p-6 text-center text-xs text-slate-600">
        <p>© 2024 Gap-Eul Score. All rights reserved.</p>
      </footer>
    </div>
  )
}

// --- Feature Card 컴포넌트 ---
function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  description: React.ReactNode
  color: string 
}) {
  return (
    <div className={`group relative overflow-hidden bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 ${color} rounded-2xl p-6 text-center transition-all duration-200 cursor-default`}>
      <div className="mb-4 p-2 w-fit mx-auto rounded-lg bg-slate-900/50 border border-slate-700/50 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}