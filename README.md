# 갭을스코어 (Gap-Eul Score) 🔍⚖️

> AI 기반 근로계약서 갑을관계 분석 플랫폼

**불공정 계약서를 AI가 자동으로 분석하고, 위험 요소를 한눈에 파악할 수 있습니다.**

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://gap-eul-score.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-blueviolet)](https://gapeulbackend-production.up.railway.app/docs)

---

## 📌 주요 기능

### 🎯 핵심 기능
- **📄 다양한 파일 형식 지원**: PDF, DOCX, TXT
- **🤖 Claude AI 기반 분석**: Anthropic Claude 4 Sonnet 활용
- **⚖️ 갑을 균형도 점수**: 0-10점 척도로 계약 공정성 평가
- **⚠️ 위험 요소 탐지**: 불공정 조항 자동 식별 및 심각도 분류
- **💡 개선 권장사항**: 조항별 수정 제안 및 복사 기능
- **📊 PDF 리포트 생성**: 분석 결과 다운로드
- **📝 Notion 연동**: 분석 결과 자동 저장

### ✨ 특징
- **실시간 분석**: 계약서 업로드 즉시 AI 분석 시작
- **직관적 UI**: 다크 모드 지원, 반응형 디자인
- **한글 최적화**: 한글 폰트 지원으로 깨짐 없는 리포트

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python 3.13)
- **AI Model**: Anthropic Claude 4 Sonnet
- **PDF Processing**: PyPDF2, ReportLab
- **Document Parsing**: python-docx
- **Notion API**: notion-client
- **Deployment**: Railway

### Infrastructure
- **Version Control**: GitHub
- **CI/CD**: Vercel (Frontend), Railway (Backend)
- **Environment**: Docker (Railway 자동 배포)

---

## 🚀 빠른 시작

### Prerequisites
```bash
# Node.js 18+ 필요
node --version

# Python 3.13+ 필요
python3 --version
```

### 1. 저장소 클론
```bash
git clone https://github.com/astridjeong-commits/gap_eul_score.git
cd gap_eul_score
```

### 2. 환경변수 설정
```bash
# 프론트엔드 (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000

# 백엔드 (gap_eul_backend/.env)
ANTHROPIC_API_KEY=your_claude_api_key
NOTION_TOKEN=your_notion_integration_token
```

### 3. 프론트엔드 실행
```bash
npm install
npm run dev
# http://localhost:3000
```

### 4. 백엔드 실행
```bash
cd ../gap_eul_backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn web_api:app --reload
# http://localhost:8000
```

---

## 📦 프로젝트 구조
```
gap_eul_score/
├── app/                    # Next.js App Router
│   ├── bridge.tsx         # 파일 업로드 & 분석 UI
│   ├── dashboard.tsx      # 분석 결과 대시보드
│   ├── onboarding.tsx     # 랜딩 페이지
│   └── page.tsx           # 메인 페이지
├── fonts/                 # 한글 폰트
└── public/               # 정적 파일

gap_eul_backend/
├── web_api.py            # FastAPI 메인 서버
├── index.py              # 분석 로직
├── fonts/                # PDF 한글 폰트
│   └── AppleGothic.ttf
└── requirements.txt      # Python 패키지
```

---

## 🎨 주요 화면

### 1️⃣ 랜딩 페이지
- 서비스 소개 및 주요 기능 안내
- "지금 시작하기" CTA

### 2️⃣ 분석 페이지
- 드래그 앤 드롭 파일 업로드
- 실시간 분석 진행 상태 표시

### 3️⃣ 결과 대시보드
- **갑을 관계 균형도**: 0-10 점수 시각화
- **총 위험도**: 위험 요소 개수 및 점수
- **주요 위험 요소**: 아코디언 형태로 상세 정보
- **개선 권장사항**: 조항별 수정 제안
- **AI 상세 분석**: Claude의 전체 분석 결과

---

## 🔑 API 엔드포인트

### Backend API (Railway)
```
POST /upload              # 파일 업로드 및 텍스트 추출
POST /analyze/with-mcp    # Claude AI 계약서 분석
POST /download-report     # PDF 리포트 생성
POST /export-notion       # Notion 페이지 생성
GET  /docs                # API 문서 (Swagger)
```

---

## 🧠 AI 분석 프로세스

1. **텍스트 추출**: PDF/DOCX → 텍스트 변환
2. **전처리**: 불필요한 공백 제거, 구조화
3. **Claude AI 분석**:
   - 조항별 위험도 평가
   - 갑을 균형도 점수 산출 (0-10)
   - 불공정 조항 식별
   - 개선 방안 제시
4. **결과 반환**: JSON 구조화 데이터

---

## 📝 개발 이력

### v1.0 (2024.12)
- ✅ 윈도우 → 맥 마이그레이션
- ✅ GitHub 저장소 생성
- ✅ Vercel 프론트엔드 배포
- ✅ Railway 백엔드 배포
- ✅ Anthropic Claude 4 Sonnet 통합
- ✅ Notion API 연동
- ✅ 한글 폰트 지원 (PDF 리포트)
- ✅ 다크 모드 UI

---

## 🔮 향후 계획

### Phase 2
- [ ] 계약서 원본에 형광펜 기능 (위험 조항 강조)
- [ ] OCR 완전 지원 (이미지 기반 PDF)
- [ ] 다국어 지원 (영문 계약서)
- [ ] 사용자 히스토리 저장

### Phase 3
- [ ] 비교 분석 (여러 계약서 동시 비교)
- [ ] 산업별 벤치마크
- [ ] 계약서 템플릿 제공

---

## 👩‍💻 개발자

**Astrid Jeong**  
- 6년차 SI 개발자 (공공기관 ERP 전문)
- AI & Big Data 분석가 과정 수료
- GitHub: [@astridjeong-commits](https://github.com/astridjeong-commits)

---

## 📄 라이선스

이 프로젝트는 개인 포트폴리오 용도로 제작되었습니다.

---

## 🙏 감사의 말

- **Anthropic Claude**: 강력한 AI 분석 엔진
- **Vercel & Railway**: 안정적인 배포 환경
- **Notion**: 편리한 데이터 저장소

---

**⚡ 불공정 계약서, 이제 AI로 한 번에 분석하세요!**

[![GitHub Stars](https://img.shields.io/github/stars/astridjeong-commits/gap_eul_score?style=social)](https://github.com/astridjeong-commits/gap_eul_score)
