'use client';

import React from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  count?: number;
}

interface TabNavigationProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  className?: string;
}

export default function TabNavigation<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}: TabNavigationProps<T>) {
  return (
    <div className={`flex border-b border-gray-700 mb-6 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === tab.id
              ? 'text-green-500 border-b-2 border-green-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.count !== undefined && ` (${tab.count})`}
        </button>
      ))}
    </div>
  );
} 