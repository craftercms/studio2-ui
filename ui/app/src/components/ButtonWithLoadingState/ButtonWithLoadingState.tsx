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

import * as React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

interface ButtonWithLoadingStateProps extends ButtonProps {
  loading?: boolean;
}

const ButtonWithLoadingState = React.forwardRef<HTMLButtonElement, ButtonWithLoadingStateProps>((props, ref) => {
  const { loading, ...rest } = props;
  return (
    <Button ref={ref} variant="contained" disabled={loading || rest.disabled} {...rest}>
      {loading ? <CircularProgress size={20} /> : props.children}
    </Button>
  );
});

export default ButtonWithLoadingState;
