export default function isCommissioned(device: { 'wellcube/device'?: { status?: string } }): boolean {
  return device['wellcube/device']?.status !== 'uncommissioned';
}
