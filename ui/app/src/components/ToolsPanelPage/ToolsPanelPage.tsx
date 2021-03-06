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

import React from 'react';
import ToolPanel from '../../modules/Preview/Tools/ToolPanel';
import { renderWidgets, WidgetDescriptor } from '../Widget';
import { useDispatch } from 'react-redux';
import { popPageBuilderPanelPage, popToolsPanelPage } from '../../state/actions/preview';
import { useActiveSiteId } from '../../utils/hooks/useActiveSiteId';
import { useActiveUser } from '../../utils/hooks/useActiveUser';
import { usePossibleTranslation } from '../../utils/hooks/usePossibleTranslation';

export interface ToolsPanelPageDescriptor {
  title: string;
  widgets: WidgetDescriptor[];
  target?: 'pageBuilderPanel' | 'toolsPanel';
}

export interface ToolsPanelPageProps extends ToolsPanelPageDescriptor {}

export default function ToolsPanelPage(props: ToolsPanelPageProps) {
  const { target = 'toolsPanel' } = props;
  const dispatch = useDispatch();
  const site = useActiveSiteId();
  const { rolesBySite } = useActiveUser();
  const popPage = target === 'toolsPanel' ? popToolsPanelPage : popPageBuilderPanelPage;
  const pop = () => dispatch(popPage());
  return (
    <ToolPanel title={usePossibleTranslation(props.title)} onBack={pop}>
      {renderWidgets(props.widgets, rolesBySite[site])}
    </ToolPanel>
  );
}
