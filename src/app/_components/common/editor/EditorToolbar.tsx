import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import EditorButton from './EditorButton';
import ColorPalette from './ColorPalette';

type EditorToolbarProps = {
  editor: Editor | null;
  onImageUpload: () => void;
  setShowImageInput: (show: boolean) => void;
  showImageInput: boolean;
  setShowLinkInput: (show: boolean) => void;
  showLinkInput: boolean;
};

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onImageUpload,
  setShowImageInput,
  showImageInput,
  setShowLinkInput,
  showLinkInput,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!editor) return null;

  // 에디터 액션들
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleHeading = (level: 1 | 2 | 3) => editor.chain().focus().toggleHeading({ level }).run();
  const setTextAlign = (align: 'left' | 'center' | 'right') => editor.chain().focus().setTextAlign(align).run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const setHorizontalRule = () => editor.chain().focus().setHorizontalRule().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const setParagraph = () => editor.chain().focus().setParagraph().run();
  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  return (
    <>
      {/* 첫 번째 툴바 줄 - 기본 서식 */}
      <div className="border-b border-gray-200 py-1 px-2 flex items-center gap-1 bg-white rounded-t-md">
        {/* 제목/단락 드롭다운 */}
        <div className="relative group border-r border-gray-200 pr-1 mr-1">
          <button
            type="button"
            className="flex items-center gap-1 px-2 h-8 rounded hover:bg-gray-100 transition-colors"
            title="글자 스타일"
          >
            <span className="font-medium">H</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white shadow-md rounded z-10 min-w-[100px]">
            <button
              type="button"
              onClick={() => toggleHeading(1)}
              className={`w-full text-left px-3 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
            >
              제목 1
            </button>
            <button
              type="button"
              onClick={() => toggleHeading(2)}
              className={`w-full text-left px-3 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
            >
              제목 2
            </button>
            <button
              type="button"
              onClick={() => toggleHeading(3)}
              className={`w-full text-left px-3 py-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
            >
              제목 3
            </button>
            <button
              type="button"
              onClick={setParagraph}
              className={`w-full text-left px-3 py-1 rounded ${editor.isActive('paragraph') ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
            >
              본문
            </button>
          </div>
        </div>
        
        {/* 텍스트 서식 버튼 */}
        <div className="flex items-center border-r border-gray-200 pr-1 mr-1">
          <EditorButton onClick={toggleBold} isActive={editor.isActive('bold')} title="굵게">
            <span className="font-bold">B</span>
          </EditorButton>
          
          <EditorButton onClick={toggleItalic} isActive={editor.isActive('italic')} title="기울임">
            <span className="italic">I</span>
          </EditorButton>
          
          <EditorButton onClick={toggleStrike} isActive={editor.isActive('strike')} title="취소선">
            <span className="line-through">S</span>
          </EditorButton>
          
          <EditorButton onClick={toggleUnderline} isActive={editor.isActive('underline')} title="밑줄">
            <span className="underline">U</span>
          </EditorButton>
        </div>
        
        {/* 정렬 버튼 */}
        <div className="flex items-center border-r border-gray-200 pr-1 mr-1">
          <EditorButton 
            onClick={() => setTextAlign('left')} 
            isActive={editor.isActive({ textAlign: 'left' })} 
            title="왼쪽 정렬"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="15" y2="12"></line>
              <line x1="3" y1="18" x2="18" y2="18"></line>
            </svg>
          </EditorButton>
          
          <EditorButton 
            onClick={() => setTextAlign('center')} 
            isActive={editor.isActive({ textAlign: 'center' })} 
            title="가운데 정렬"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="6" y1="12" x2="18" y2="12"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </EditorButton>
          
          <EditorButton 
            onClick={() => setTextAlign('right')} 
            isActive={editor.isActive({ textAlign: 'right' })} 
            title="오른쪽 정렬"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="9" y1="12" x2="21" y2="12"></line>
              <line x1="6" y1="18" x2="21" y2="18"></line>
            </svg>
          </EditorButton>
        </div>
        
        {/* 목록 버튼 */}
        <div className="flex items-center border-r border-gray-200 pr-1 mr-1">
          <EditorButton 
            onClick={toggleBulletList} 
            isActive={editor.isActive('bulletList')} 
            title="글머리 기호"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </EditorButton>
          
          <EditorButton 
            onClick={toggleOrderedList} 
            isActive={editor.isActive('orderedList')} 
            title="번호 매기기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="10" y1="6" x2="21" y2="6"></line>
              <line x1="10" y1="12" x2="21" y2="12"></line>
              <line x1="10" y1="18" x2="21" y2="18"></line>
              <g>
                <text x="3" y="6" fontSize="6" fill="currentColor" strokeWidth="0">1</text>
                <text x="3" y="12" fontSize="6" fill="currentColor" strokeWidth="0">2</text>
                <text x="3" y="18" fontSize="6" fill="currentColor" strokeWidth="0">3</text>
              </g>
            </svg>
          </EditorButton>
        </div>
      </div>
      
      {/* 두 번째 툴바 줄 - 추가 기능 */}
      <div className="border-b border-gray-200 py-1 px-2 flex items-center gap-1 bg-white">
        {/* 인용구 및 구분선 */}
        <div className="flex items-center border-r border-gray-200 pr-1 mr-1">
          <EditorButton 
            onClick={toggleBlockquote} 
            isActive={editor.isActive('blockquote')} 
            title="인용구"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 22h12a2 2 0 0 0 2-2V6.5L15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"></path>
              <path d="M14 2v5h5"></path>
              <path d="M10 9H8v5h2c1.5 0 2 .5 2 2v0c0 1.5-.5 2-2 2h0"></path>
            </svg>
          </EditorButton>
          
          <EditorButton 
            onClick={setHorizontalRule} 
            title="구분선"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </EditorButton>
          
          <EditorButton 
            onClick={toggleCodeBlock} 
            isActive={editor.isActive('codeBlock')} 
            title="코드 블록"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </EditorButton>
        </div>
        
        {/* 색상 버튼 */}
        <div className="relative group border-r border-gray-200 pr-1 mr-1">
          <EditorButton 
            onClick={() => setShowColorPicker(!showColorPicker)} 
            isActive={showColorPicker} 
            title="텍스트 색상"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 22h20L12 2z"/>
              <path d="M7.5 18h9" strokeWidth="3" stroke="currentColor"/>
            </svg>
          </EditorButton>
          
          {/* 색상 팔레트 */}
          {showColorPicker && <ColorPalette onSelectColor={setColor} />}
        </div>
        
        {/* 미디어 버튼 */}
        <div className="flex items-center border-r border-gray-200 pr-1 mr-1">
          <EditorButton onClick={onImageUpload} title="이미지 업로드">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </EditorButton>
          
          <EditorButton 
            onClick={() => setShowImageInput(!showImageInput)} 
            isActive={showImageInput} 
            title="이미지 URL 추가"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <line x1="21" y1="14" x2="18" y2="14"></line>
              <line x1="21" y1="19" x2="16" y2="19"></line>
              <line x1="14" y1="15" x2="14" y2="20"></line>
            </svg>
          </EditorButton>
        </div>
        
        {/* 링크 버튼 */}
        <div className="flex items-center">
          <EditorButton 
            onClick={() => setShowLinkInput(!showLinkInput)} 
            isActive={editor.isActive('link') || showLinkInput} 
            title="링크 추가"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </EditorButton>
        </div>
      </div>
    </>
  );
};

export default EditorToolbar; 