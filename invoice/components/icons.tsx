import type { IconType } from "react-icons";
import {
  HiOutlineArrowDownTray,
  HiOutlineArrowLeft,
  HiOutlineArrowPath,
  HiOutlineArrowRight,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowUpTray,
  HiOutlineBanknotes,
  HiOutlineBars3,
  HiOutlineBell,
  HiOutlineChartBar,
  HiOutlineChevronDown,
  HiOutlineClock,
  HiOutlineCog6Tooth,
  HiOutlineDocumentArrowDown,
  HiOutlineDocumentText,
  HiOutlineEllipsisHorizontal,
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineMinus,
  HiOutlinePaperAirplane,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineQuestionMarkCircle,
  HiOutlineSquares2X2,
  HiOutlineArrowRightOnRectangle,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineXMark,
} from "react-icons/hi2";
import type { Section } from "@/lib/routes";

export const Icons = {
  dashboard: HiOutlineHome,
  invoices: HiOutlineDocumentText,
  customers: HiOutlineUserGroup,
  payments: HiOutlineBanknotes,
  received: HiOutlineDocumentArrowDown,
  reports: HiOutlineChartBar,
  settings: HiOutlineCog6Tooth,
  menu: HiOutlineBars3,
  close: HiOutlineXMark,
  chevronDown: HiOutlineChevronDown,
  more: HiOutlineEllipsisHorizontal,
  help: HiOutlineQuestionMarkCircle,
  bell: HiOutlineBell,
  search: HiOutlineMagnifyingGlass,
  plus: HiOutlinePlus,
  minus: HiOutlineMinus,
  edit: HiOutlinePencilSquare,
  trash: HiOutlineTrash,
  send: HiOutlinePaperAirplane,
  download: HiOutlineArrowDownTray,
  upload: HiOutlineArrowUpTray,
  back: HiOutlineArrowLeft,
  external: HiOutlineArrowRight,
  trendUp: HiOutlineArrowTrendingUp,
  clock: HiOutlineClock,
  refresh: HiOutlineArrowPath,
  grid: HiOutlineSquares2X2,
  logout: HiOutlineArrowRightOnRectangle,
  user: HiOutlineUser,
} as const;

export const SECTION_ICONS: Record<Section, IconType> = {
  Dashboard: Icons.dashboard,
  Invoices: Icons.invoices,
  Customers: Icons.customers,
  Payments: Icons.payments,
  Received: Icons.received,
  Reports: Icons.reports,
  Settings: Icons.settings,
};

type IconProps = {
  icon: IconType;
  size?: number;
  className?: string;
  title?: string;
};

export function AppIcon({ icon: Icon, size = 16, className }: IconProps) {
  return <Icon size={size} className={className} aria-hidden />;
}
