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

import { Epic, ofType } from 'redux-observable';
import {
  FETCH_COMPONENTS_BY_CONTENT_TYPE,
  FETCH_CONTENT_TYPES,
  fetchComponentsByContentTypeComplete,
  fetchComponentsByContentTypeFailed,
  fetchContentTypesComplete,
  fetchContentTypesFailed
} from '../actions/preview';
import { exhaustMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { fetchItemsByContentType } from '../../services/content';
import { catchAjaxError } from '../../utils/ajax';
import GlobalState from '../../models/GlobalState';
import { Observable } from 'rxjs';
import { fetchContentTypes } from '../../services/contentTypes';

const fetch: Epic = (action$, state$) =>
  action$.pipe(
    ofType(FETCH_CONTENT_TYPES),
    withLatestFrom(state$),
    exhaustMap(([, { sites: { active: site } }]) =>
      fetchContentTypes(site).pipe(map(fetchContentTypesComplete), catchAjaxError(fetchContentTypesFailed))
    )
  );

const fetchComponentsByContentType: Epic = (action$, state$: Observable<GlobalState>) =>
  action$.pipe(
    ofType(FETCH_COMPONENTS_BY_CONTENT_TYPE),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      fetchItemsByContentType(
        state.sites.active,
        state.preview.components.contentTypeFilter,
        state.contentTypes.byId,
        state.preview.components.query
      ).pipe(map(fetchComponentsByContentTypeComplete), catchAjaxError(fetchComponentsByContentTypeFailed))
    )
  );

export default [fetch, fetchComponentsByContentType] as Epic[];
