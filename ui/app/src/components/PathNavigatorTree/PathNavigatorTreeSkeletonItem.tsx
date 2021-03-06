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

import Skeleton from '@material-ui/lab/Skeleton';
import { rand } from '../PathNavigator/utils';
import * as React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

interface PathNavigatorTreeSkeletonItemProps {
  textWidth?: string;
  classes?: Partial<Record<'root', string>>;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: { display: 'flex' }
  })
);

export default function PathNavigatorTreeSkeletonItem(props: PathNavigatorTreeSkeletonItemProps) {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.classes?.root)}>
      <Skeleton variant="circle" width="20px" style={{ marginRight: '10px' }} />
      <Skeleton variant="text" style={{ margin: '0 10px', width: props.textWidth ?? `${rand(60, 95)}%` }} />
    </div>
  );
}
