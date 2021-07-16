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
import Dialog from '@material-ui/core/Dialog';
import { SingleFileUploadDialogContainer, uploadType } from './SingleFileUploadDialogContainer';
import StandardAction from '../../models/StandardAction';

interface SingleFileUploadDialogBaseProps {
  open: boolean;
  path: string;
  uploadType: uploadType;
  profileId?: string;
  validTypesRegex?: string | RegExp | [string, string];
  validTypesLabel?: string;
}

export type SingleFileUploadDialogProps = PropsWithChildren<
  SingleFileUploadDialogBaseProps & {
    onClose(): void;
    onSuccess?(): void;
    onClosed?(): void;
  }
>;

export interface SingleFileUploadDialogStateProps extends SingleFileUploadDialogBaseProps {
  onClose?: StandardAction;
  onSuccess?: StandardAction;
  onClosed?: StandardAction;
}

export default function SingleFileUploadDialog(props: SingleFileUploadDialogProps) {
  const { uploadType, validTypesRegex, profileId, validTypesLabel, path, onClosed, onSuccess, ...rest } = props;

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <SingleFileUploadDialogContainer
        profileId={profileId}
        uploadType={uploadType}
        validTypesRegex={validTypesRegex}
        validTypesLabel={validTypesLabel}
        path={path}
        onSuccess={onSuccess}
        onClose={props.onClose}
        onClosed={onClosed}
      />
    </Dialog>
  );
}
