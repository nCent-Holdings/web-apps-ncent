import React, { useEffect, useState } from 'react';
import { produce } from 'immer';
import _ from 'lodash';
import { Button, CheckboxTree, OvalLoader } from '@ncent-holdings/ux-components';
import { useDispatch, useSelector } from 'react-redux';
import dmSelectors from '../../../../features/device-management/dm.selectors';
import { dmActions } from '../../../../features/device-management/dm.slice';
import { findRootParent } from './FindRootParent';
import { TreeNode } from './types';
import { replaceClassName } from '../../../../utils/stringUtils';

interface FilterSpaceProps {
  handleFilter: (isOpen: boolean) => void;
}

const CLASSNAME_BG_SELECTED = '!bg-[#DBE8F2]';
const CLASSNAME_TEXT_COLOR_SELECTED = '!font-bold';
const COLOR_ICON_SELECTED = '#272B32';

const FilterSpace = ({ handleFilter }: FilterSpaceProps) => {
  const [checkedSpaces, setCheckedSpaces] = useState<string[]>([]);
  const [nodes, setNodes] = useState<any>([]);
  const dispatch = useDispatch();

  const searchSpacesIds = useSelector(dmSelectors.selectSearchSpacesIds);

  const topLevelSpaces = useSelector(dmSelectors.selectTopLevelSpaces);
  const selectSpacesFilter = useSelector(dmSelectors.selectFullOrderedSpaces);

  const [allowSave, setAllowSave] = useState(false);
  const [allowClear, setAllowClear] = useState(false);

  const cleanupNode = (node: TreeNode) => {
    node.classNameCustomContainer = replaceClassName(CLASSNAME_BG_SELECTED, '', node.classNameCustomContainer);
    node.classNameCustomLabel = replaceClassName(CLASSNAME_TEXT_COLOR_SELECTED, '', node.classNameCustomLabel);

    node.iconColor = node.iconColor === COLOR_ICON_SELECTED ? '#667085' : node.iconColor;

    return node;
  };

  const updateSelectedNode = (node: TreeNode) => {
    if (!node.classNameCustomContainer?.includes(CLASSNAME_BG_SELECTED)) {
      node.classNameCustomContainer = node.classNameCustomContainer + ' ' + CLASSNAME_BG_SELECTED;
    }

    if (!node.classNameCustomLabel?.includes(CLASSNAME_TEXT_COLOR_SELECTED)) {
      node.classNameCustomLabel = node.classNameCustomLabel + ' ' + CLASSNAME_TEXT_COLOR_SELECTED;
    }

    node.iconColor = COLOR_ICON_SELECTED;

    return node;
  };

  const handleCleanSelection = () => {
    if (nodes?.length === 0 || topLevelSpaces?.length === 0) return;

    const cleanNodes = produce(nodes, (draft: TreeNode[]) => {
      topLevelSpaces.forEach((topSpace) => {
        const index = draft.findIndex((node: TreeNode) => node.id === topSpace.id);

        if (index < 0) return;

        draft[index] = cleanupNode(draft[index]);
      });
    });

    setNodes(cleanNodes);
  };

  const handleCheckSelection = () => {
    let parentNodesSelected: string[] = [];

    for (let index = 0; index < checkedSpaces.length; index++) {
      const id = checkedSpaces[index];
      const isTopSelected = topLevelSpaces.some((topSpace) => topSpace.id === id);

      //Option 1 - Clicked Space === TopParentSpace
      if (isTopSelected) {
        parentNodesSelected = _.union(parentNodesSelected, [id]);
        continue;
      }

      //Option 2 - Clicked space is a N Child
      const parentIdSelected = findRootParent(nodes, id);

      if (parentIdSelected) {
        parentNodesSelected = _.union(parentNodesSelected, [parentIdSelected]);
      }
    }

    if (parentNodesSelected?.length > 0) {
      const updatedNodes = produce(nodes, (draft: TreeNode[]) => {
        //Cleanup
        for (let index = 0; index < nodes.length; index++) {
          draft[index] = cleanupNode(draft[index]);
        }

        parentNodesSelected?.forEach((parentId) => {
          const index = draft.findIndex((node: TreeNode) => node.id === parentId);

          if (index < 0) return;
          draft[index] = updateSelectedNode(draft[index]);
        });
      });

      setNodes(updatedNodes);
    }
  };

  useEffect(() => {
    if (selectSpacesFilter) {
      setNodes(selectSpacesFilter);
    }
  }, [selectSpacesFilter]);

  useEffect(() => {
    handleCleanSelection();

    if (checkedSpaces && checkedSpaces.length > 0) {
      handleCheckSelection();
      setAllowSave(true);
    } else {
      setAllowSave(false);
    }
  }, [checkedSpaces]);

  useEffect(() => {
    if (!searchSpacesIds) {
      return setCheckedSpaces([]);
    }

    if (searchSpacesIds.length > 0) {
      setAllowClear(true);
    } else {
      setAllowClear(false);
    }

    setCheckedSpaces(searchSpacesIds);
  }, [searchSpacesIds]);

  const handleApply = () => {
    dispatch(dmActions.setSearchSpacesIds({ spacesIds: checkedSpaces }));

    setAllowClear(true);
    handleFilter(false);
  };

  const handleClose = () => {
    handleFilter(false);
  };

  const handleClear = () => {
    dispatch(dmActions.setSearchSpacesIds({ spacesIds: [] }));
    setCheckedSpaces([]);
  };

  return (
    <div className="h-full py-5">
      <div className="flex px-4">
        <div className="text-h3 font">Filters</div>
        <span className="ml-auto flex cursor-pointer items-center text-h5 text-grey-200" onClick={handleClose}>
          <i className="icon wcicon-xmark " />
        </span>
      </div>
      <div className="h-6" />
      <div className="flex items-center justify-between bg-white-background px-5 py-2">By space</div>
      {selectSpacesFilter?.length === 0 ? (
        <div className="flex justify-center p-4">
          <OvalLoader />
        </div>
      ) : (
        <>
          <div className="my-6">
            <CheckboxTree
              nodes={nodes}
              checked={checkedSpaces}
              onCheck={setCheckedSpaces}
              classNameNodeContainer="px-5 py-[6px]"
              classNameCheckboxIconContainer="ml-auto"
            />
          </div>
          <div className="sticky bottom-0 flex gap-[25px] border-t border-[#D4DFEA] bg-white px-[75px] py-[40px]">
            <Button
              variant="inverse"
              disabled={!allowClear}
              label="CLEAR"
              className="min-w-[95px] text-[.75rem]"
              onClick={handleClear}
            />
            <Button
              disabled={!allowSave}
              label="APPLY"
              className="min-w-[95px] text-[.75rem]"
              variant="primary"
              onClick={handleApply}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FilterSpace;
