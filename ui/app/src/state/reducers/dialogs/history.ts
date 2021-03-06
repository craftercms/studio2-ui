/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { createReducer } from '@reduxjs/toolkit';
import GlobalState from '../../../models/GlobalState';
import { HistoryDialogStateProps } from '../../../modules/Content/History/HistoryDialog';
import {
  closeHistoryDialog,
  historyDialogClosed,
  showCompareVersionsDialog,
  showHistoryDialog,
  showViewVersionDialog
} from '../../actions/dialogs';

const initialState: HistoryDialogStateProps = {
  open: false
};

export default createReducer<GlobalState['dialogs']['history']>(initialState, {
  [showHistoryDialog.type]: (state, { payload }) => ({
    ...state,
    onClose: closeHistoryDialog(),
    onClosed: historyDialogClosed(),
    onDismiss: closeHistoryDialog(),
    ...payload,
    open: true
  }),
  [closeHistoryDialog.type]: (state) => ({
    ...state,
    open: false
  }),
  [historyDialogClosed.type]: () => initialState,
  [showViewVersionDialog.type]: (state) => ({
    ...state,
    open: false
  }),
  [showCompareVersionsDialog.type]: (state) => ({
    ...state,
    open: false
  })
});
