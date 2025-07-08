import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '../public/images');
const ORIGINAL_DIR = path.join(__dirname, '../public/images/original');

// 지원하는 이미지 확장자
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.tiff', '.tif'];

// 제외할 폴더들
const EXCLUDED_FOLDERS = ['original'];

// original 디렉토리 생성
if (!fs.existsSync(ORIGINAL_DIR)) {
  fs.mkdirSync(ORIGINAL_DIR, { recursive: true });
}

async function optimizeAndMoveImage(originalPath, webpPath, originalDestPath) {
  try {
    const stats = fs.statSync(originalPath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    
    console.log(`🔄 변환 중: ${path.basename(originalPath)} (${fileSizeInMB.toFixed(2)}MB)`);
    
    // 1. WebP로 변환하여 같은 폴더에 생성
    await sharp(originalPath)
      .webp({ quality: 80 })
      .toFile(webpPath);
    
    // 2. 원본 파일을 original 폴더로 이동
    fs.renameSync(originalPath, originalDestPath);
    
    const newStats = fs.statSync(webpPath);
    const newSizeInMB = newStats.size / (1024 * 1024);
    const reduction = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);
    
    console.log(`✅ 완료: ${path.basename(webpPath)} (${newSizeInMB.toFixed(2)}MB, ${reduction}% 감소)`);
    console.log(`📁 원본 이동: ${path.basename(originalDestPath)}`);
    
  } catch (error) {
    console.error(`❌ 처리 실패: ${path.basename(originalPath)}`, error.message);
  }
}

async function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 제외할 폴더인지 확인
      if (EXCLUDED_FOLDERS.includes(file)) {
        console.log(`⏭️  폴더 스킵: ${file} (제외 목록)`);
        continue;
      }
      
      // 하위 디렉토리 처리
      await processDirectory(filePath);
    } else {
      // 파일 처리
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        const baseName = path.basename(file, ext);
        const relativePath = path.relative(IMAGES_DIR, dirPath);
        
        // WebP 파일은 같은 폴더에 생성
        const webpPath = path.join(dirPath, `${baseName}.webp`);
        
        // 원본 파일은 original 폴더로 이동
        const originalDestDir = relativePath ? 
          path.join(ORIGINAL_DIR, relativePath) : 
          ORIGINAL_DIR;
        
        if (!fs.existsSync(originalDestDir)) {
          fs.mkdirSync(originalDestDir, { recursive: true });
        }
        
        const originalDestPath = path.join(originalDestDir, file);
        
        // 이미 변환된 webp 파일이 있는지 확인
        if (fs.existsSync(webpPath)) {
          console.log(`⏭️  스킵: ${file} (이미 webp 파일 존재)`);
          continue;
        }
        
        // 이미 원본이 original 폴더에 있는지 확인
        if (fs.existsSync(originalDestPath)) {
          console.log(`⏭️  스킵: ${file} (이미 original 폴더에 존재)`);
          continue;
        }
        
        await optimizeAndMoveImage(filePath, webpPath, originalDestPath);
      }
    }
  }
}

async function main() {
  console.log('🚀 이미지 최적화 및 정리 시작...');
  console.log(`📁 이미지 디렉토리: ${IMAGES_DIR}`);
  console.log(`📁 원본 보관 디렉토리: ${ORIGINAL_DIR}`);
  console.log(`🚫 제외 폴더: ${EXCLUDED_FOLDERS.join(', ')}`);
  console.log('');
  console.log('📋 작업 순서:');
  console.log('  1️⃣  원본 파일 → WebP 변환');
  console.log('  2️⃣  원본 파일 → original 폴더로 이동');
  console.log('  3️⃣  WebP 파일 → 기존 위치에 배치');
  console.log('');
  
  const startTime = Date.now();
  
  try {
    await processDirectory(IMAGES_DIR);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('');
    console.log(`🎉 최적화 완료! (${duration}초 소요)`);
    console.log('💡 사용법: <BackgroundImage src="/images/your-image.webp" />');
    console.log('📁 원본 파일들은 /images/original/ 폴더에 보관됨');
    
  } catch (error) {
    console.error('❌ 최적화 중 오류 발생:', error);
    process.exit(1);
  }
}

main(); 