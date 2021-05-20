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

import React, { PropsWithChildren } from 'react';
import { ContentTypeField } from '../../models/ContentType';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import Divider from '@material-ui/core/Divider';

type AudiencesFormSectionProps = PropsWithChildren<{
  field: ContentTypeField;
  showDivider?: boolean;
}>;

export function AudiencesFormSection(props: AudiencesFormSectionProps) {
  const { field, showDivider, children } = props;
  return (
    <>
      <Grid item xs={12}>
        {children}
        <FormHelperText>{field.helpText}</FormHelperText>
      </Grid>
      {showDivider && <Divider style={{ margin: '15px 0' }} />}
    </>
  );
}
