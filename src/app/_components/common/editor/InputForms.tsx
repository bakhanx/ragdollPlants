import React from 'react';

type ImageInputFormProps = {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  addImage: () => void;
  closeForm: () => void;
};

export const ImageInputForm: React.FC<ImageInputFormProps> = ({
  imageUrl,
  setImageUrl,
  addImage,
  closeForm
}) => {
  return (
    <div className="flex flex-col border-b border-gray-200 p-2 bg-gray-50">
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="이미지 URL 입력 (https://...)"
        className="mb-2 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={closeForm}
          className="mr-2 px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm"
        >
          취소
        </button>
        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm"
        >
          추가
        </button>
      </div>
    </div>
  );
};

type LinkInputFormProps = {
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  linkText: string;
  setLinkText: (text: string) => void;
  addLink: () => void;
  closeForm: () => void;
};

export const LinkInputForm: React.FC<LinkInputFormProps> = ({
  linkUrl,
  setLinkUrl,
  linkText,
  setLinkText,
  addLink,
  closeForm
}) => {
  return (
    <div className="flex flex-col border-b border-gray-200 p-2 bg-gray-50">
      <input
        type="text"
        value={linkText}
        onChange={(e) => setLinkText(e.target.value)}
        placeholder="링크 텍스트 (선택 사항)"
        className="mb-2 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
      <input
        type="text"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        placeholder="URL 입력 (https://...)"
        className="mb-2 rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={closeForm}
          className="mr-2 px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm"
        >
          취소
        </button>
        <button
          type="button"
          onClick={addLink}
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm"
        >
          추가
        </button>
      </div>
    </div>
  );
}; 