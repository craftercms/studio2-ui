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

import React, { useEffect, useMemo, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogHeader from '../Dialogs/DialogHeader';
import DialogBody from '../Dialogs/DialogBody';
import DialogFooter from '../Dialogs/DialogFooter';
import { useActiveSiteId, useLogicResource } from '../../utils/hooks';
import { FormattedMessage } from 'react-intl';
import { diffConflictedFile as diffConflictedFileService } from '../../services/repositories';
import ApiResponse from '../../models/ApiResponse';
import { FileDiff } from '../../models/Repository';
import { SuspenseWithEmptyState } from '../SystemStatus/Suspencified';
import RemoteRepositoriesDiffDialogUI from './RemoteRepositoriesDiffDialogUI';
import SecondaryButton from '../SecondaryButton';
import ConfirmDropdown from '../Controls/ConfirmDropdown';
import { useIntl } from 'react-intl';
import { messages } from '../RemoteRepositoriesStatus';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    conflictActionButton: {
      color: theme.palette.warning.dark,
      borderColor: theme.palette.warning.main
    }
  })
);

export interface RemoteRepositoriesDiffDialogProps {
  open: boolean;
  path: string;
  onResolveConflict(strategy: string, path: string): void;
  onClose(): void;
}

export default function RemoteRepositoriesDiffDialog(props: RemoteRepositoriesDiffDialogProps) {
  const { open, path, onResolveConflict, onClose } = props;
  const siteId = useActiveSiteId();
  const [tab, setTab] = useState(0);
  const [fileDiff, setFileDiff] = useState<FileDiff>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<ApiResponse>();
  const { formatMessage } = useIntl();
  const classes = useStyles();

  useEffect(() => {
    const diffConflictedFile = (path) => {
      if (path) {
        setFetching(true);
        diffConflictedFileService(siteId, path).subscribe(
          (fileDiff) => {
            setFileDiff(fileDiff);
            setFetching(false);
          },
          ({ response }) => {
            setError(response);
            setFetching(false);
          }
        );
      }
    };

    diffConflictedFile(path);
  }, [path, siteId]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const resource = useLogicResource<FileDiff, { fileDiff: FileDiff; error: ApiResponse; fetching: boolean }>(
    useMemo(() => ({ fileDiff, error, fetching }), [fileDiff, error, fetching]),
    {
      shouldResolve: (source) => Boolean(source.fileDiff) && !fetching,
      shouldReject: ({ error }) => Boolean(error),
      shouldRenew: (source, resource) => fetching && resource.complete,
      resultSelector: (source) => source.fileDiff,
      errorSelector: () => error
    }
  );

  const resolveConflict = (strategy: string, path: string) => {
    onResolveConflict(strategy, path);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogHeader
        title={
          <>
            <FormattedMessage id="words.diff" defaultMessage="Diff" />
            <Typography variant="subtitle2">{path}</Typography>
          </>
        }
        onDismiss={onClose}
      />
      <DialogBody>
        <SuspenseWithEmptyState resource={resource}>
          <RemoteRepositoriesDiffDialogUI resource={resource} tab={tab} handleTabChange={handleTabChange} />
        </SuspenseWithEmptyState>
      </DialogBody>
      <DialogFooter>
        <SecondaryButton onClick={onClose}>
          <FormattedMessage id="words.close" defaultMessage="Close" />
        </SecondaryButton>
        <ConfirmDropdown
          classes={{ button: classes.conflictActionButton }}
          text={formatMessage(messages.acceptRemote)}
          cancelText={formatMessage(messages.no)}
          confirmText={formatMessage(messages.yes)}
          confirmHelperText={formatMessage(messages.acceptRemoteHelper)}
          onConfirm={() => resolveConflict('theirs', path)}
        />
        <ConfirmDropdown
          classes={{ button: classes.conflictActionButton }}
          text={formatMessage(messages.keepLocal)}
          cancelText={formatMessage(messages.no)}
          confirmText={formatMessage(messages.yes)}
          confirmHelperText={formatMessage(messages.keepLocalHelper)}
          onConfirm={() => resolveConflict('ours', path)}
        />
      </DialogFooter>
    </Dialog>
  );
}