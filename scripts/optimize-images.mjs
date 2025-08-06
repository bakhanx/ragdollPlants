import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const originalDir = path.join(__dirname, '../public/images/original');
const outputDir = path.join(__dirname, '../public/images');

// 지원하는 이미지 확장자
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];

async function optimizeImages() {
  try {
    // original 폴더 존재 확인
    if (!fs.existsSync(originalDir)) {
      console.log('❌ public/images/original 폴더가 존재하지 않습니다.');
      return;
    }

    // original 폴더의 파일 목록 가져오기
    const files = fs.readdirSync(originalDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedExtensions.includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log('📁 original 폴더에 최적화할 이미지가 없습니다.');
      return;
    }

    console.log(`🚀 ${imageFiles.length}개의 이미지 최적화를 시작합니다...\n`);

    let processedCount = 0;
    let skippedCount = 0;

    for (const file of imageFiles) {
      const inputPath = path.join(originalDir, file);
      const fileName = path.parse(file).name;
      const outputPath = path.join(outputDir, `${fileName}.webp`);

      // 이미 변환된 파일이 있는지 확인
      if (fs.existsSync(outputPath)) {
        console.log(`⏭️  건너뜀: ${file} (이미 존재함)`);
        skippedCount++;
        continue;
      }

      try {
        // Sharp를 사용하여 WebP로 변환
        await sharp(inputPath)
          .webp({ 
            quality: 85,  // 품질 85%
            effort: 6     // 압축 노력도 (0-6, 높을수록 더 작은 파일)
          })
          .toFile(outputPath);

        // 파일 크기 비교
        const originalStats = fs.statSync(inputPath);
        const optimizedStats = fs.statSync(outputPath);
        const reduction = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1);

        console.log(`✅ ${file} → ${fileName}.webp (${reduction}% 감소)`);
        processedCount++;

      } catch (error) {
        console.log(`❌ 실패: ${file} - ${error.message}`);
      }
    }

    console.log(`\n🎉 최적화 완료!`);
    console.log(`   처리됨: ${processedCount}개`);
    console.log(`   건너뜀: ${skippedCount}개`);

  } catch (error) {
    console.error('❌ 이미지 최적화 중 오류 발생:', error.message);
  }
}

optimizeImages();