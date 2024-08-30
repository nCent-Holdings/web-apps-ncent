import React, { useCallback, useMemo, useState } from 'react';
import { ColumnDef, SortingState } from '@tanstack/react-table';

import { PurifierModel } from '../../../api-types/models';

import DevicesListBase from './DevicesListBase';
import { getColumns } from './PurifierColsDef';

import { DEVICE_TYPE, Purifier } from './types';
import { dumpPurifierModel } from './dumps';

import SetMode from './set-mode/SetMode';

export type PurifiersListProps = {
  purifiers: PurifierModel[];
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  sorting: SortingState;
  onSortChange: (newSorting: SortingState) => void;
  onClickCard: (...args: any[]) => void;
};

const PurifiersList: React.FC<PurifiersListProps> = ({
  purifiers,
  loading,
  emptyMessage,
  sorting,
  onSortChange,
  onClickCard,
}) => {
  const [showSetMode, setShowSetMode] = useState(false);
  const [purifierData, setPurifierData] = useState<Purifier | undefined>();

  const handleCloseSetMode = () => {
    setShowSetMode(false);
  };

  const handleFanModeEdit = useCallback((evt: React.MouseEvent<Element, MouseEvent>, purifier: Purifier) => {
    evt.stopPropagation();

    setShowSetMode(true);
    setPurifierData(purifier);
  }, []);

  const handleReorder = useCallback((evt: React.MouseEvent<Element, MouseEvent>, purifier: Purifier) => {
    evt.stopPropagation();

    console.log('Reorder clicked for purifier:', purifier);
  }, []);

  const columns: ColumnDef<Purifier, string>[] = useMemo(() => {
    return getColumns({
      onFanModeEdit: handleFanModeEdit,
      onReorder: handleReorder,
    });
  }, [handleFanModeEdit, handleReorder]);

  const purifiersData: Purifier[] = purifiers.map(dumpPurifierModel);

  return (
    <>
      <DevicesListBase<Purifier>
        data={purifiersData}
        columns={columns}
        deviceType={DEVICE_TYPE.PURIFIER}
        loading={loading}
        emptyMessage={emptyMessage}
        sorting={sorting}
        onSortChange={onSortChange}
        onClickCard={onClickCard}
      />
      {showSetMode && (
        <SetMode
          openSetMode={showSetMode}
          handleCloseModal={handleCloseSetMode}
          purifierData={purifierData}
          updatePurifierData={setPurifierData}
        />
      )}
    </>
  );
};

export default React.memo(PurifiersList);
