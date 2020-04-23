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

import { createAction, createReducer } from '@reduxjs/toolkit';
import StandardAction from '../../../models/StandardAction';
import GlobalState from '../../../models/GlobalState';

interface HistoryConfigProps {
  path: string;
  environment?: string;
  module?: string;
  config?: boolean;
}

export const showViewVersionDialog = createAction<any>('SHOW_VIEW_VERSION_DIALOG');

export const closeViewVersionDialog = createAction<StandardAction>('CLOSE_VIEW_VERSION_DIALOG');

export const fetchContentVersion = createAction<any>('FETCH_CONTENT_VERSION');

export const fetchItemVersionComplete = createAction<any>('FETCH_CONTENT_VERSION_COMPLETE');

export const fetchItemVersionFailed = createAction<any>('FETCH_CONTENT_VERSION_FAILED');

const initialState = {
  open: false,
  isFetching: null,
  version: null,
  historyDialog: null,
};

export default createReducer<GlobalState['dialogs']['viewVersion']>(initialState, {
  [showViewVersionDialog.type]: (state, { payload }) => ({
    ...state,
    onDismiss: closeViewVersionDialog(),
    ...payload,
    open: true,
    isFetching: true
  }),
  [closeViewVersionDialog.type]: (state) => ({
    ...initialState,
    onClose: state.onClose
  }),
  [fetchItemVersionComplete.type]: (state, { payload }) => ({
    ...state,
    isFetching: false,
    version: payload
  }),
  [fetchItemVersionFailed.type]: () => ({
    isFetching: false
  })
});
