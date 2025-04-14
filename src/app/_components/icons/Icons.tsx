import { SVGProps, ComponentType } from 'react';
import Water from '@/../public/svg/water.svg';
import Water2 from '@/../public/svg/water2.svg';
import Nutrient from '@/../public/svg/vape-kit.svg';
import Pin from '@/../public/svg/pin.svg';

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