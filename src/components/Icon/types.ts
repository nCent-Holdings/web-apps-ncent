export interface IconProps extends React.HTMLAttributes<HTMLImageElement> {
  active?: boolean;
  activeIconSrc?: string;
  altActive?: string;
  inactiveIconSrc?: string;
  altInactive?: string;
}
