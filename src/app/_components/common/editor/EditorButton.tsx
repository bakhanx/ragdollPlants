import React from 'react';

type EditorButtonProps = {
  onClick?: () => void;
  isActive?: boolean;
  title?: string;
  children: React.ReactNode;
};

// 에디터에서 사용할 버튼 컴포넌트
const EditorButton: React.FC<EditorButtonProps> = ({ 
  onClick, 
  isActive = false, 
  title = '', 
  children 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1 h-8 w-8 flex items-center justify-center rounded ${
        isActive ? 'bg-gray-200' : 'hover:bg-gray-100'
      }`}
      title={title}
    >
      {children}
    </button>
  );
};

export default EditorButton; 