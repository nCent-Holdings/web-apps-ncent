export const UpdateStatus = {
  SAVING: 'Saving',
  SAVED: 'Saved',
  ERROR: 'Error',
} as const;

type StatusClasses = {
  containerClass: string;
  textClass: string;
};

export type Status = (typeof UpdateStatus)[keyof typeof UpdateStatus];

export const StatusMap: Record<Status, StatusClasses> = {
  Saving: { containerClass: 'bg-blue-sky', textClass: 'text-blue-dar' },
  Saved: { containerClass: 'bg-[#ECFDF3]', textClass: 'text-[#027A48]' },
  Error: { containerClass: 'bg-[#FF7276]', textClass: 'text-[#AB2328]' },
};

export interface BadgeStatusProps {
  status: Status;
  statusMessage?: string;
  classExtend?: string;
}
