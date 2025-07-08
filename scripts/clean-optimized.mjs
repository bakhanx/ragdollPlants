import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '../public/images');
const ORIGINAL_DIR = path.join(__dirname, '../public/images/original');

function restoreOriginalFiles(originalDir, targetDir) {
  if (!fs.existsSync(originalDir)) {
    console.log(`📁 original 폴더가 없습니다: ${originalDir}`);
    return;
  }

  const files = fs.readdirSync(originalDir);
  
  for (const file of files) {
    const originalPath = path.join(originalDir, file);
    const stat = fs.statSync(originalPath);
    
    if (stat.isDirectory()) {
      // 하위 디렉토리 처리
      const subTargetDir = path.join(targetDir, file);
      if (!fs.existsSync(subTargetDir)) {
        fs.mkdirSync(subTargetDir, { recursive: true });
      }
      restoreOriginalFiles(originalPath, subTargetDir);
    } else {
      // 파일 복원
      const targetPath = path.join(targetDir, file);
      const baseName = path.basename(file, path.extname(file));
      const webpPath = path.join(targetDir, `${baseName}.webp`);
      
      // webp 파일이 있으면 삭제
      if (fs.existsSync(webpPath)) {
        fs.unlinkSync(webpPath);
        console.log(`🗑️  WebP 삭제: ${path.relative(IMAGES_DIR, webpPath)}`);
      }
      
      // 원본 파일 복원
      fs.renameSync(originalPath, targetPath);
      console.log(`📁 복원: ${path.relative(IMAGES_DIR, targetPath)}`);
    }
  }
}

function cleanEmptyDirectories(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath);
  
  // 하위 디렉토리들 먼저 정리
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      cleanEmptyDirectories(filePath);
    }
  }
  
  // 현재 디렉토리가 비어있으면 삭제
  const remainingFiles = fs.readdirSync(dirPath);
  if (remainingFiles.length === 0) {
    fs.rmdirSync(dirPath);
    console.log(`🗑️  빈 폴더 삭제: ${path.relative(IMAGES_DIR, dirPath)}`);
  }
}

function main() {
  console.log('🔄 이미지 최적화 되돌리기...');
  console.log(`📁 이미지 디렉토리: ${IMAGES_DIR}`);
  console.log(`📁 원본 폴더: ${ORIGINAL_DIR}`);
  console.log('');
  console.log('📋 작업 순서:');
  console.log('  1️⃣  WebP 파일 삭제');
  console.log('  2️⃣  원본 파일들을 원래 위치로 복원');
  console.log('  3️⃣  빈 original 폴더 정리');
  console.log('');
  
  try {
    // 원본 파일들 복원 및 webp 파일 삭제
    restoreOriginalFiles(ORIGINAL_DIR, IMAGES_DIR);
    
    // 빈 디렉토리들 정리
    cleanEmptyDirectories(ORIGINAL_DIR);
    
    console.log('');
    console.log('🎉 되돌리기 완료!');
    console.log('💡 이제 다시 npm run optimize-images 를 실행할 수 있습니다.');
    
  } catch (error) {
    console.error('❌ 되돌리기 중 오류 발생:', error);
    process.exit(1);
  }
}

main(); 