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

import React, { useMemo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CrafterIcon from '../Icons/CrafterIcon';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { defineMessages, useIntl } from 'react-intl';
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch } from 'react-redux';
import { showLauncher } from '../../state/actions/dialogs';
import { LauncherStateProps } from '../Launcher/Launcher';
import AppsRounded from '@material-ui/icons/AppsRounded';

const useStyles = makeStyles((theme) =>
  createStyles({
    logoIconButton: {
      padding: '7px'
    },
    crafterIcon: {
      fontSize: '1.4em'
    }
  })
);

const messages = defineMessages({
  menu: {
    id: 'launcherOpenerButton.menuTooltip',
    defaultMessage: 'Navigation Menu'
  },
  openDrawer: {
    id: 'launcherOpenerButton.openMenuButtonText',
    defaultMessage: 'Open Menu'
  }
});

let instanceCount = 0;

interface LauncherOpenerButtonProps {
  icon?: 'logo' | 'apps';
  sitesRailPosition?: LauncherStateProps['sitesRailPosition'];
  closeButtonPosition?: 'left' | 'right';
}

export default function LauncherOpenerButton(props: LauncherOpenerButtonProps) {
  const classes = useStyles({});
  const { sitesRailPosition = 'right', icon = 'logo', closeButtonPosition = 'right' } = props;
  const { formatMessage } = useIntl();
  const id = useMemo(() => `toolbarLauncherButton${instanceCount++}`, []);
  const dispatch = useDispatch();
  const onMenuClick = () => dispatch(showLauncher({ anchor: `#${id}`, sitesRailPosition, closeButtonPosition }));
  return (
    <Tooltip title={formatMessage(messages.menu)}>
      <IconButton
        id={id}
        aria-label={formatMessage(messages.openDrawer)}
        onClick={onMenuClick}
        className={icon === 'logo' ? classes.logoIconButton : void 0}
      >
        {icon === 'logo' ? <CrafterIcon className={classes.crafterIcon} /> : <AppsRounded />}
      </IconButton>
    </Tooltip>
  );
}
