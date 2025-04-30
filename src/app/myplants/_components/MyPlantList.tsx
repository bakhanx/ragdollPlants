'use client';

import { useFilteredItems } from '@/app/_hooks/useFilteredItems';
import { SearchInput } from '@/app/_components/common/SearchInput';
import Image from 'next/image';
import Link from 'next/link';
import { WaterIcon, NutrientIcon } from '@/app/_components/icons/Icons';
import { UploadButton } from '@/app/_components/common/UploadButton';

export type MyPlant = {
  id: number;
  name: string;
  imageUrl: string;
  needsWater: boolean;
  needsNutrient: boolean;
  lastWatered: string;
  plantType: string;
};

export const MyPlantList = ({
  initialPlants
}: {
  initialPlants: MyPlant[];
}) => {
  const { visibleItems, handleSearch } = useFilteredItems<MyPlant>({
    items: initialPlants,
    filterFn: (item, query) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.plantType.toLowerCase().includes(query.toLowerCase())
  });

  const maxPlants = 20;
  const isMax = initialPlants.length >= maxPlants;

  return (
    <div className="py-8">
      <div className="mt-4 mb-6 flex justify-between">
        <div className="w-full max-w-xs">
          <SearchInput
            onSearch={handleSearch}
            placeholder="식물 이름 또는 종류 검색"
          />
        </div>
        <UploadButton
          link="/myplants/register"
          disabled={isMax}
          count={initialPlants.length}
          maxCount={maxPlants}
          title="식물 등록"
        />
      </div>
      {visibleItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {visibleItems.map(plant => (
            <Link
              href={`/myplants/${plant.id}`}
              key={plant.id}
              className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={plant.imageUrl}
                  alt={plant.name}
                  fill
                  className="object-cover brightness-80 filter transition-all duration-200 hover:brightness-100"
                />
                {/* 물/영양 아이콘 */}
                <div className="absolute top-2 right-2 flex space-y-1 gap-x-2">
                  {plant.needsWater && (
                    <div className="rounded-full bg-blue-100 p-1.5">
                      <WaterIcon
                        size={16}
                        className="[&_path]:fill-blue-600"
                      />
                    </div>
                  )}
                  {plant.needsNutrient && (
                    <div className="rounded-full bg-amber-100 p-1.5">
                      <NutrientIcon
                        size={16}
                        className="[&_path]:fill-amber-600"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-medium text-gray-900">{plant.name}</h3>
                <p className="text-xs text-gray-500">{plant.plantType}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-gray-50 text-center">
          <p className="mb-2 text-gray-200">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};
