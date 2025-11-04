import React from 'react';
import Ship from './Ship';
import type { Ship as ShipType } from '@/types/game';

interface ShipListProps {
  ships: ShipType[];
  title?: string;
  selectedShipId?: string | null;
  onShipClick?: (ship: ShipType) => void;
  showSkills?: boolean;
}

/**
 * 船リストコンポーネント
 * 複数の船を一覧表示
 *
 * Props:
 * - ships: 船の配列
 * - title: リストのタイトル
 * - selectedShipId: 選択中の船ID
 * - onShipClick: 船クリック時のコールバック
 * - showSkills: スキル情報を表示するか
 */
export default function ShipList({
  ships,
  title,
  selectedShipId,
  onShipClick,
  showSkills = true,
}: ShipListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* タイトル */}
      {title && (
        <h2 className="text-xl font-bold text-purple-800 mb-4">{title}</h2>
      )}

      {/* 船リスト */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ships.map((ship) => (
          <Ship
            key={ship.id}
            ship={ship}
            isSelected={ship.id === selectedShipId}
            onClick={onShipClick ? () => onShipClick(ship) : undefined}
          />
        ))}
      </div>

      {/* 撃沈数サマリー */}
      <div className="mt-4 pt-4 border-t border-purple-200">
        <div className="flex justify-between text-sm">
          <span className="text-purple-700">残存:</span>
          <span className="font-bold text-green-600">
            {ships.filter((s) => !s.sunk).length} / {ships.length}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-purple-700">撃沈:</span>
          <span className="font-bold text-red-600">
            {ships.filter((s) => s.sunk).length} / {ships.length}
          </span>
        </div>
      </div>
    </div>
  );
}
