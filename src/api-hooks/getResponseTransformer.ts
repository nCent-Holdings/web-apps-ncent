import type { EntityState, EntityAdapter } from '@reduxjs/toolkit';

function getResponseTransformer<TEntity>(entityAdapter: EntityAdapter<TEntity>) {
  return (response: TEntity[]): EntityState<TEntity> => {
    return entityAdapter.addMany(entityAdapter.getInitialState(), response);
  };
}

export default getResponseTransformer;
