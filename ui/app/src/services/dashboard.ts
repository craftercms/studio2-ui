/*
 * Copyright (C) 2007-2021 Crafter Software Corporation. All Rights Reserved.
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

import { get } from '../utils/ajax';
import { toQueryString } from '../utils/object';
import { pluck } from 'rxjs/operators';
import { LegacyDashboardItem, LegacyDeploymentHistoryResponse } from '../models/Dashboard';
import { Observable } from 'rxjs';

export function fetchLegacyGetGoLiveItems(
  site: string,
  sortBy?: string,
  sortAsc?: boolean,
  includeInProgress?: boolean,
  filterByNumber?: number
): Observable<LegacyDashboardItem> {
  const qs = toQueryString({
    site,
    ...(sortBy
      ? {
          sort: sortBy,
          ascending: sortAsc
        }
      : {}),
    ...(includeInProgress && { includeInProgress }),
    ...(filterByNumber && { num: filterByNumber })
  });
  return get(`/studio/api/1/services/api/1/workflow/get-go-live-items.json${qs}`).pipe(pluck('response'));
}

export function fetchLegacyUserActivities(
  site: string,
  user: string,
  sortBy: string,
  sortAsc: boolean,
  numResults: number,
  filterBy: string,
  excludeLive: boolean
): Observable<LegacyDashboardItem> {
  const qs = toQueryString({
    site,
    user,
    ...(sortBy
      ? {
          sort: sortBy,
          ascending: sortAsc
        }
      : {}),
    ...(numResults && { num: numResults }),
    ...(filterBy && { filterType: filterBy }),
    excludeLive
  });
  return get(`/studio/api/1/services/api/1/activity/get-user-activities.json${qs}`).pipe(pluck('response'));
}

export function fetchLegacyScheduledItems(
  site: string,
  sort: string,
  ascending: boolean,
  filterType: string
): Observable<LegacyDashboardItem> {
  const qs = toQueryString({
    site,
    sort,
    ascending,
    filterType
  });
  return get(`/studio/api/1/services/api/1/deployment/get-scheduled-items.json${qs}`).pipe(pluck('response'));
}

export function fetchLegacyDeploymentHistory(
  siteId: string,
  sortBy: string,
  sortAsc: boolean,
  days: number,
  numResults: number,
  filterBy: string
): Observable<LegacyDeploymentHistoryResponse> {
  const qs = toQueryString({
    siteId,
    ...(sortBy
      ? {
          sort: sortBy,
          ascending: sortAsc
        }
      : {}),
    ...(days && { days }),
    ...(numResults && { num: numResults }),
    ...(filterBy && { filterType: filterBy })
  });
  return get(`/studio/api/2/publish/history.json${qs}`).pipe(pluck('response'));
}
