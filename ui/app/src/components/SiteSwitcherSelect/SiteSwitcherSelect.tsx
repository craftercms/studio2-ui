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

import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { FormattedMessage } from 'react-intl';
import Select, { SelectProps } from '@material-ui/core/Select';
import useStyles from './styles';
import { isBlank } from '../../utils/string';
import { changeSite } from '../../state/reducers/sites';
import { setSiteCookie } from '../../utils/auth';
import { getSystemLink } from '../LauncherSection';
import { useDispatch } from 'react-redux';
import { usePreviewState } from '../../utils/hooks/usePreviewState';
import { useEnv } from '../../utils/hooks/useEnv';
import { useSiteList } from '../../utils/hooks/useSiteList';
import clsx from 'clsx';

export interface SiteSwitcherSelectProps extends SelectProps {
  site: string;
}

function SiteSwitcherSelect(props: SiteSwitcherSelectProps) {
  const { site, ...rest } = props;
  const sites = useSiteList();
  const classes = useStyles();
  const { previewChoice } = usePreviewState();
  const { authoringBase } = useEnv();
  const dispatch = useDispatch();

  const onSiteChange = ({ target: { value } }) => {
    if (!isBlank(value) && site !== value) {
      if (previewChoice[value] === '2') {
        dispatch(changeSite(value));
      } else {
        setSiteCookie(value);
        setTimeout(
          () =>
            (window.location.href = getSystemLink({
              site: value,
              systemLinkId: 'preview',
              previewChoice,
              authoringBase
            }))
        );
      }
    }
  };

  return (
    <Select
      displayEmpty
      variant="standard"
      {...rest}
      className={clsx(classes.menuRoot, props.className)}
      classes={{
        ...props.classes,
        select: clsx(classes.input, props.classes?.select),
        selectMenu: clsx(classes.menu, props.classes?.selectMenu)
      }}
      value={site}
      onChange={onSiteChange}
    >
      {sites.length === 0 && (
        <MenuItem value="">
          <FormattedMessage id="siteSwitcherSelected.siteSelectorNoSiteSelected" defaultMessage="Choose site" />
        </MenuItem>
      )}
      {sites.map(({ id, name }) => (
        <MenuItem key={id} value={id} className={classes.menuItem}>
          {name}
        </MenuItem>
      ))}
    </Select>
  );
}

export default SiteSwitcherSelect;
