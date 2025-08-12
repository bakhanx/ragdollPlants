import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const originalDir = path.join(__dirname, '../public/images/original');
const outputDir = path.join(__dirname, '../public/images');

async function cleanOptimizedImages() {
  try {
    // original 폴더 존재 확인
    if (!fs.existsSync(originalDir)) {
      console.log('❌ public/images/original 폴더가 존재하지 않습니다.');
      return;
    }

    // original 폴더의 파일 목록 가져오기
    const originalFiles = fs.readdirSync(originalDir);
    const originalNames = originalFiles.map(file => path.parse(file).name);

    if (originalNames.length === 0) {
      console.log('📁 original 폴더에 파일이 없습니다.');
      return;
    }

    console.log('🧹 최적화된 이미지 파일들을 정리합니다...\n');

    let deletedCount = 0;
    let notFoundCount = 0;

    for (const baseName of originalNames) {
      const webpPath = path.join(outputDir, `${baseName}.webp`);

      if (fs.existsSync(webpPath)) {
        try {
          fs.unlinkSync(webpPath);
          console.log(`🗑️  삭제됨: ${baseName}.webp`);
          deletedCount++;
        } catch (error) {
          console.log(`❌ 삭제 실패: ${baseName}.webp - ${error.message}`);
        }
      } else {
        console.log(`⏭️  없음: ${baseName}.webp`);
        notFoundCount++;
      }
    }

    console.log(`\n✨ 정리 완료!`);
    console.log(`   삭제됨: ${deletedCount}개`);
    console.log(`   없었음: ${notFoundCount}개`);

  } catch (error) {
    console.error('❌ 이미지 정리 중 오류 발생:', error.message);
  }
}

cleanOptimizedImages();