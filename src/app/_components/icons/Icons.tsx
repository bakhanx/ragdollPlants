import { SVGProps, ComponentType } from 'react';
import Water from '@/../public/svg/water.svg';
import Water2 from '@/../public/svg/water2.svg';
import Nutrient from '@/../public/svg/vape-kit.svg';
import Pin from '@/../public/svg/pin.svg';
import Edit from '@/../public/svg/edit.svg';
import ChevronLeft from '@/../public/svg/chevron-left.svg';
import ChevronRight from '@/../public/svg/chevron-right.svg';
import Cross from '@/../public/svg/cross.svg';
import MoreVertical from '@/../public/svg/more-vertical.svg';
import ThreeHline from '@/../public/svg/menu.svg';
import Bell from '@/../public/svg/bell.svg';
import Share from '@/../public/svg/share.svg';
import ArrowUp from '@/../public/svg/arrow-up.svg';
import Schedule from '@/../public/svg/schedule.svg';
import Image from '@/../public/svg/image.svg';
import Search from '@/../public/svg/search.svg';
import SignOut from '@/../public/svg/sign-out.svg';
import Heart from '@/../public/svg/heart.svg';
import ArticleIconSvg from '@/../public/svg/text-align-justified.svg';
import Nutrient2 from '@/../public/svg/vape-kit.svg';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

const createIcon = (
  SvgComponent: ComponentType<SVGProps<SVGSVGElement>>,
  displayName: string
) => {
  const IconComponent = ({
    size = 16,
    className = '',
    ...props
  }: IconProps) => (
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

// 아이콘 컴포넌트 생성
export const WaterIcon = createIcon(Water, 'WaterIcon');
export const Water2Icon = createIcon(Water2, 'Water2Icon');
export const NutrientIcon = createIcon(Nutrient, 'NutrientIcon');
export const Nutrient2Icon = createIcon(Nutrient2, 'Nutrient2Icon');
export const PinIcon = createIcon(Pin, 'PinIcon');
export const EditIcon = createIcon(Edit, 'EditIcon');

// UI 관련 아이콘 추가
export const BackIcon = createIcon(ChevronLeft, 'BackIcon');
export const ChevronLeftIcon = createIcon(ChevronLeft, 'ChevronLeftIcon');
export const ChevronRightIcon = createIcon(ChevronRight, 'ChevronRightIcon');
export const CloseIcon = createIcon(Cross, 'CloseIcon');
export const MenuIcon = createIcon(MoreVertical, 'MenuIcon');
export const HamburgerIcon = createIcon(ThreeHline, 'HamburgerIcon');
export const BellIcon = createIcon(Bell, 'BellIcon');
export const ShareIcon = createIcon(Share, 'ShareIcon');
export const ArrowUpIcon = createIcon(ArrowUp, 'ArrowUpIcon');
export const ScheduleIcon = createIcon(Schedule, 'ScheduleIcon');
export const ImageIcon = createIcon(Image, 'ImageIcon');
export const SearchIcon = createIcon(Search, 'SearchIcon');
export const SignOutIcon = createIcon(SignOut, 'SignOutIcon');
export const HeartIcon = createIcon(Heart, 'HeartIcon');
export const ArticleIcon = createIcon(ArticleIconSvg, 'ArticleIcon');

// 모든 아이콘을 하나의 객체로 묶어서 export
export const Icons = {
  Water: WaterIcon,
  Water2: Water2Icon,
  Nutrient: NutrientIcon,
  Nutrient2: Nutrient2Icon,
  Pin: PinIcon,
  Edit: EditIcon,
  Back: BackIcon,
  ChevronRight: ChevronRightIcon,
  Close: CloseIcon,
  Menu: MenuIcon,
  Hamburger: HamburgerIcon,
  Bell: BellIcon,
  Share: ShareIcon,
  Image: ImageIcon,
  Search: SearchIcon,
  SignOut: SignOutIcon,
  Heart: HeartIcon,
  Article: ArticleIcon
};
