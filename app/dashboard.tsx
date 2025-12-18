"use client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

import { useState } from "react"
import { 
  Scale, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Moon, 
  Sun, 
  TrendingUp,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Send,
  ArrowLeft
} from "lucide-react"

// ⭐ Props 타입 정의
interface DashboardProps {
  contractText: string;
  analysisResult: any;
  fileName: string;
  onBack: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// --- UI 컴포넌트 ---
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

const Badge = ({ className, variant = "default", children, ...props }: any) => {
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground",
    destructive: "border-transparent bg-red-500/20 text-red-400 border-red-500/50",
    warning: "border-transparent bg-amber-500/20 text-amber-400 border-amber-500/50",
    success: "border-transparent bg-green-500/20 text-green-400 border-green-500/50",
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

const Card = ({ className, children, ...props }: any) => (
  <div 
    className={`bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl ${className}`} 
    {...props}
  >
    {children}
  </div>
)

// ⭐ Progress 컴포넌트 - 색상 prop 추가
const Progress = ({ value, className, color = "cyan" }: { value: number; className?: string; color?: string }) => {
  const colorClasses = {
    cyan: "from-cyan-500 to-blue-500",
    green: "from-green-500 to-emerald-500",
    yellow: "from-yellow-500 to-amber-500",
    orange: "from-orange-500 to-red-500",
    red: "from-red-500 to-rose-600"
  }
  
  return (
    <div className={`h-2 w-full bg-slate-800 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan} rounded-full transition-all duration-300`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

// --- 메인 Dashboard 컴포넌트 ---
export default function DashboardPage({ 
  contractText, 
  analysisResult, 
  fileName,
  onBack,
  isDarkMode,
  toggleTheme
}: DashboardProps) {
  const theme = isDarkMode ? "dark" : "light"
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string>("")

  // ⭐ PDF 다운로드 함수
  const handleDownloadReport = async () => {
    try {
      console.log("📥 PDF 다운로드 시작...")
      
      const response = await fetch(`${API_URL}/download-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          analysis_result: analysisResult,
          contract_text: contractText
        })
      })
      
      if (!response.ok) {
        throw new Error("PDF 생성 실패")
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gap_eul_report_${new Date().getTime()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      console.log("✅ PDF 다운로드 완료")
    } catch (error) {
      console.error("❌ PDF 다운로드 오류:", error)
      alert("PDF 다운로드 중 오류가 발생했습니다.")
    }
  }

  // ⭐ Notion 내보내기 함수
  const handleExportToNotion = async () => {
    if (!analysisResult) return

    setIsExporting(true)
    setError("")

    try {
      const fileNameWithoutExt = fileName.replace(/\.(pdf|docx|txt)$/i, '')
      
      const response = await fetch(`${API_URL}/export-notion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis_result: analysisResult,
          contract_text: contractText,
          file_name: fileNameWithoutExt
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Notion 저장 중 오류가 발생했습니다.")
      }

      const data = await response.json()
      alert(`✅ Notion에 저장되었습니다!\n\n페이지 URL: ${data.page_url}`)
      window.open(data.page_url, '_blank')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Notion 저장 중 오류가 발생했습니다."
      setError(errorMessage)
      alert(errorMessage)
    } finally {
      setIsExporting(false)
    }
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold">분석 결과가 없습니다</h2>
          <p className="text-slate-400">파일을 업로드하고 분석을 진행해주세요.</p>
        </div>
      </div>
    )
  }

  // ⭐ 분석 결과 파싱
  const balanceScore = analysisResult.balance_score || 0
  const totalRisk = analysisResult.total_risk || 0
  const risks = analysisResult.risks || []
  const recommendations = analysisResult.recommendations || []
  const rawAnalysis = analysisResult.raw_response || analysisResult.analysis || ""

  // ⭐ 균형도 만점 계산 (동적)
  const maxBalanceScore = 10.0

  // 점수에 따른 상태 계산
  const getScoreStatus = (score: number) => {
    if (score <= 1.5) return { label: "매우 불리함", color: "text-red-400", bgColor: "bg-red-500/20" }
    if (score <= 2.5) return { label: "불리함", color: "text-amber-400", bgColor: "bg-amber-500/20" }
    if (score <= 3.5) return { label: "보통", color: "text-yellow-400", bgColor: "bg-yellow-500/20" }
    if (score <= 4.5) return { label: "균형적", color: "text-green-400", bgColor: "bg-green-500/20" }
    return { label: "매우 균형적", color: "text-cyan-400", bgColor: "bg-cyan-500/20" }
  }

  // ⭐ 위험도에 따른 색상 계산
  const getRiskStatus = (risk: number) => {
    if (risk < 30) return { 
      label: "낮음", 
      color: "text-green-400", 
      bgColor: "bg-green-500/20",
      progressColor: "green" 
    }
    if (risk < 40) return { 
      label: "보통", 
      color: "text-yellow-400", 
      bgColor: "bg-yellow-500/20",
      progressColor: "yellow" 
    }
    if (risk < 50) return { 
      label: "높음", 
      color: "text-orange-400", 
      bgColor: "bg-orange-500/20",
      progressColor: "orange" 
    }
    return { 
      label: "매우 높음", 
      color: "text-red-400", 
      bgColor: "bg-red-500/20",
      progressColor: "red" 
    }
  }

  const scoreStatus = getScoreStatus(balanceScore)
  const riskStatus = getRiskStatus(totalRisk)

  return (
    <div className={`${theme} min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 font-sans`}>
      
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center border-b border-slate-700/50">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="mr-2"
            title="뒤로가기"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Scale className="h-6 w-6 text-cyan-500 fill-cyan-500/10" /> 
          <span className="text-lg font-bold tracking-tight">Gap-Eul Score</span>
          <Badge variant="success" className="ml-2">분석 완료</Badge>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadReport}
          >
            <Download className="h-4 w-4 mr-2" />
            리포트 다운로드
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportToNotion}
            disabled={isExporting}
          >
            <Send className="h-4 w-4 mr-2" />
            {isExporting ? "저장 중..." : "Notion 저장"}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* 점수 카드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 갑을 관계 균형도 */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <TrendingUp className="h-5 w-5 text-cyan-500 mr-2" />
                갑을 관계 균형도
              </h2>
              <Badge className={scoreStatus.bgColor}>{scoreStatus.label}</Badge>
            </div>
            
            <div className="flex items-center justify-center my-8">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-8 border-slate-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${scoreStatus.color}`}>
                      {balanceScore.toFixed(1)}
                    </div>
                    {/* ⭐ 동적 만점 표시 */}
                    <div className="text-sm text-slate-400 mt-1">/ {maxBalanceScore.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-400">
              <p>• 점수가 낮을수록 계약 당사자(을)에게 불리한 조항이 많습니다</p>
              <p>• 3.0 이상이면 비교적 균형잡힌 계약입니다</p>
            </div>
          </Card>

          {/* 총 위험도 */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Shield className="h-5 w-5 text-red-500 mr-2" />
                총 위험도
              </h2>
              <Badge variant="destructive">위험 요소 {risks.length}개</Badge>
            </div>

            <div className="flex items-center justify-center my-8">
              <div className="text-center">
                {/* ⭐ 동적 색상 적용 */}
                <div className={`text-6xl font-bold ${riskStatus.color}`}>{totalRisk}</div>
                <div className="text-sm text-slate-400 mt-2">위험 점수</div>
              </div>
            </div>

            {/* ⭐ 동적 색상 Progress bar */}
            <Progress 
              value={Math.min((totalRisk / 100) * 100, 100)} 
              color={riskStatus.progressColor}
              className="mb-4" 
            />

            <div className="space-y-2 text-sm text-slate-400">
              <p>• 위험도 50 이상: 계약 재검토 필요</p>
              <p>• 위험도 30-50: 일부 조항 수정 권장</p>
              <p>• 위험도 30 미만: 비교적 안전</p>
            </div>
          </Card>
        </div>

        {/* 주요 위험 요소 (아코디언) */}
        {risks.length > 0 && (
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              주요 위험 요소
            </h2>
            
            <div className="space-y-4">
              {risks.map((risk: any, index: number) => (
                <div 
                  key={index}
                  className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden transition-all"
                >
                  <div 
                    onClick={() => setExpandedRisk(expandedRisk === index ? null : index)}
                    className="p-6 cursor-pointer hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="bg-red-500/20 p-2 rounded-lg">
                          <Shield className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-200">{risk.category || risk.name}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="destructive">위험도 {risk.severity || risk.risk_score}</Badge>
                              {expandedRisk === index ? (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{risk.location || '조항 위치 미상'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
                      "{risk.matched_text || risk.clause}"
                    </div>
                  </div>

                  {expandedRisk === index && (
                    <div className="px-6 pb-6 space-y-4 border-t border-slate-700/50 pt-4">
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-amber-400 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          왜 위험한가요?
                        </h4>
                        <p className="text-sm text-slate-300">
                          {risk.explanation || "이 조항은 계약 당사자(을)에게 불리하거나 일방적인 의무를 부과할 수 있습니다. 계약 체결 전 변호사나 전문가와 상담하시기를 권장합니다."}
                        </p>
                      </div>
                      
                      <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                        <h4 className="font-semibold mb-2 text-green-400 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          수정 제안
                        </h4>
                        <p className="text-sm text-slate-300 mb-3">
                          {risk.suggested_fix || "이 조항을 다음과 같이 수정할 것을 제안합니다: 상호 합의 하에 계약을 해지할 수 있으며, 양 당사자는 30일 전 서면 통지를 해야 합니다."}
                        </p>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            navigator.clipboard.writeText(risk.suggested_fix || "수정안 복사 완료")
                            alert("수정안이 클립보드에 복사되었습니다!")
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2"/>
                          수정안 복사하기
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 권장 사항 */}
        {recommendations.length > 0 && (
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              개선 권장사항
            </h2>
            
            <div className="space-y-3">
              {recommendations.map((rec: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 bg-slate-800/30 p-4 rounded-lg"
                >
                  <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-sm text-slate-300 flex-1">{rec}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* AI 원문 분석 결과 */}
        {rawAnalysis && (
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <FileText className="h-5 w-5 text-cyan-500 mr-2" />
              AI 상세 분석
            </h2>
            
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 font-mono text-sm text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {rawAnalysis}
            </div>
          </Card>
        )}

        {/* 계약서 원문 미리보기 */}
//         <Card className="p-8">
//           <h2 className="text-xl font-bold mb-6">계약서 원문 (처음 500자)</h2>
//           <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 text-sm text-slate-400">
//             {contractText.substring(0, 500)}...
//           </div>
//           <p className="text-xs text-slate-500 mt-3">전체 {contractText.length.toLocaleString()}자</p>
//         </Card>

      </main>

      <footer className="w-full p-6 text-center text-xs text-slate-600 border-t border-slate-700/50 mt-12">
        <p>© 2024 Gap-Eul Score. All rights reserved.</p>
      </footer>
    </div>
  )
}