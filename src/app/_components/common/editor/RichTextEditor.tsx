'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

import EditorToolbar from './EditorToolbar';
import { ImageInputForm, LinkInputForm } from './InputForms';

type RichTextEditorProps = {
  onChange: (content: string) => void;
  initialContent?: string;
  className?: string;
  placeholder?: string;
};

/**
 * 리치 텍스트 에디터 컴포넌트
 * 텍스트 서식, 색상, 이미지, 링크 등 다양한 편집 기능을 제공합니다.
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  onChange, 
  initialContent = '',
  className = '',
  placeholder = '내용을 입력하세요...'
}) => {
  // 상태 관리
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  
  // 파일 입력 참조
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 에디터 인스턴스 생성
  const editor = useEditor({
    extensions: [
      StarterKit, // 기본 확장 기능들 포함 (Bold, Italic, Strike, Heading 등)
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // 에디터 내용이 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  // 이미지 추가 핸들러
  const addImage = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  // 링크 추가 핸들러
  const addLink = () => {
    if (linkUrl) {
      if (linkText) {
        // 현재 선택된 텍스트 저장
        const { from, to } = editor!.state.selection;
        const currentText = editor!.state.doc.textBetween(from, to, '');
        
        // 현재 선택된 텍스트가 없으면 직접 입력한 텍스트 삽입
        if (!currentText) {
          editor?.chain().focus().insertContent(linkText).run();
        }
      }
      
      editor
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
      
      setLinkUrl('');
      setLinkText('');
      setShowLinkInput(false);
    }
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // 실제 구현에서는 서버에 업로드하여 URL을 받아와야 함
        // 임시로 Base64 이미지 URL 사용
        const result = reader.result as string;
        editor?.chain().focus().setImage({ src: result }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 업로드 버튼 클릭 핸들러
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 에디터가 로드되지 않았을 때
  if (!editor) {
    return <div className="h-96 w-full animate-pulse rounded-md bg-gray-100"></div>;
  }

  return (
    <div className={`flex flex-col rounded-md bg-white shadow-sm ${className}`}>
      {/* 툴바 */}
      <EditorToolbar 
        editor={editor}
        onImageUpload={handleImageUploadClick}
        setShowImageInput={setShowImageInput}
        showImageInput={showImageInput}
        setShowLinkInput={setShowLinkInput}
        showLinkInput={showLinkInput}
      />
      
      {/* 이미지 URL 입력 폼 */}
      {showImageInput && (
        <ImageInputForm 
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          addImage={addImage}
          closeForm={() => setShowImageInput(false)}
        />
      )}
      
      {/* 링크 입력 폼 */}
      {showLinkInput && (
        <LinkInputForm 
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          linkText={linkText}
          setLinkText={setLinkText}
          addLink={addLink}
          closeForm={() => setShowLinkInput(false)}
        />
      )}
      
      {/* 숨겨진 파일 업로드 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* 편집기 */}
      <EditorContent
        editor={editor}
        className="min-h-[400px] p-4 max-w-none focus:outline-none rounded-b-md"
      />

      <style jsx global>{`
        /* 기본 편집기 스타일 */
        .ProseMirror {
          min-height: 400px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .ProseMirror:focus {
          outline: none;
        }
        
        /* 제목 스타일 */
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
          line-height: 1.2;
        }
        
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.83em 0;
          line-height: 1.2;
        }
        
        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 1em 0;
          line-height: 1.2;
        }
        
        /* 링크 스타일 */
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }
        
        /* 이미지 스타일 */
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
          border-radius: 4px;
          display: block;
        }
        
        /* 단락 스타일 */
        .ProseMirror p {
          margin: 0.5em 0;
          line-height: 1.5;
        }
        
        /* 코드 블록 스타일 */
        .ProseMirror pre {
          background-color: #f1f5f9;
          color: #334155;
          padding: 0.75em 1em;
          border-radius: 4px;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
          font-size: 0.9em;
          overflow-x: auto;
          margin: 1em 0;
        }
        
        /* 인용구 스타일 */
        .ProseMirror blockquote {
          border-left: 3px solid #e2e8f0;
          padding-left: 1em;
          margin-left: 0;
          margin-right: 0;
          color: #64748b;
        }
        
        /* 구분선 스타일 */
        .ProseMirror hr {
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 2em 0;
        }
        
        /* 목록 스타일 */
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        
        .ProseMirror li {
          margin: 0.2em 0;
        }
        
        .ProseMirror ul li {
          list-style-type: disc;
        }
        
        .ProseMirror ol li {
          list-style-type: decimal;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor; 