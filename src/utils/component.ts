export const getComponentName = (component: React.ReactElement) => {
  if (typeof component.type === 'string') {
    return component.type;
  }
  return component.type.name || 'Component';
};
