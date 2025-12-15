'use server'

export async function extractTextFromPdf(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file) {
    return { success: false, error: '파일이 없습니다.' };
  }

  try {
    // 1. 파일을 버퍼로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. pdf-parse 라이브러리 불러오기 (이 부분이 핵심 변경!)
    // 상단 import 대신 함수 내부에서 require를 사용하여 Turbopack 검사를 우회합니다.
    const pdfParse = require('pdf-parse');
    
    // 3. 텍스트 추출 실행
    const data = await pdfParse(buffer);
    
    return { success: true, text: data.text };
  } catch (error) {
    console.error('PDF 파싱 에러:', error);
    return { success: false, error: 'PDF를 읽는 도중 오류가 발생했습니다.' };
  }
}