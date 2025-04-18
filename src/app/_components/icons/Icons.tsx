import { SVGProps, ComponentType } from 'react';
import Water from '@/../public/svg/water.svg';
import Water2 from '@/../public/svg/water2.svg';
import Nutrient from '@/../public/svg/vape-kit.svg';
import Pin from '@/../public/svg/pin.svg';
import Edit from '@/../public/svg/edit.svg';
import ChevronLeft from '@/../public/svg/chevron-left.svg';
import Cross from '@/../public/svg/cross.svg';
import MoreVertical from '@/../public/svg/more-vertical.svg';
import ThreeHline from '@/../public/svg/menu.svg';
import Bell from '@/../public/svg/bell.svg';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

const createIcon = (SvgComponent: ComponentType<SVGProps<SVGSVGElement>>, displayName: string) => {
  const IconComponent = ({ size = 16, className = '', ...props }: IconProps) => (
    <SvgComponent
      width={size}
      height={size}
      className={`transition-colors ${className}`}
      {...props}
    />
  );
  IconComponent.displayName = displayName;
  return IconComponent;
};

export const WaterIcon = createIcon(Water, 'WaterIcon');
export const Water2Icon = createIcon(Water2, 'Water2Icon');
export const NutrientIcon = createIcon(Nutrient, 'NutrientIcon');
export const PinIcon = createIcon(Pin, 'PinIcon');
export const EditIcon = createIcon(Edit, 'EditIcon');

// UI 관련 아이콘 추가
export const BackIcon = createIcon(ChevronLeft, 'BackIcon');
export const CloseIcon = createIcon(Cross, 'CloseIcon'); 
export const MenuIcon = createIcon(MoreVertical, 'MenuIcon');
export const HamburgerIcon = createIcon(ThreeHline, 'HamburgerIcon');
export const BellIcon = createIcon(Bell, 'BellIcon');

// 인라인 SVG 아이콘 (외부 파일 없이 직접 SVG 정의)
export function ShareIcon({ size = 16, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={`transition-colors ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}