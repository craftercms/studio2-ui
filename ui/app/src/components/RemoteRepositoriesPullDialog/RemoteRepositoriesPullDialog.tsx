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

import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogHeader from '../Dialogs/DialogHeader';
import DialogBody from '../Dialogs/DialogBody';
import DialogFooter from '../Dialogs/DialogFooter';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { MergeStrategy } from '../../models/Repository';
import { pull as pullService } from '../../services/repositories';
import { useActiveSiteId } from '../../utils/hooks';
import ApiResponse from '../../models/ApiResponse';

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {
      marginBottom: '15px'
    }
  })
);

export interface RemoteRepositoriesPullDialogProps {
  open: boolean;
  branches: string[];
  remoteName: string;
  mergeStrategies: MergeStrategy[];
  onClose(): void;
  onPullSuccess?(): void;
  onPullError?(response: ApiResponse): void;
}

export default function RemoteRepositoriesPullDialog(props: RemoteRepositoriesPullDialogProps) {
  const { open, branches, remoteName, mergeStrategies, onClose, onPullSuccess, onPullError } = props;
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedMergeStrategy, setSelectedMergeStrategy] = useState(mergeStrategies[0].key);
  const classes = useStyles();
  const siteId = useActiveSiteId();
  const [disableBackdropClick, setDisableBackdropClick] = useState(false);

  const onChange = (e: any) => {
    e.persist();
    if (e.target.name === 'branch') {
      setSelectedBranch(e.target.value);
      setDisableBackdropClick(true);
    } else if (e.target.name === 'mergeStrategy') {
      setSelectedMergeStrategy(e.target.value);
    }
  };

  const pull = () => {
    pullService({
      siteId,
      remoteName,
      remoteBranch: selectedBranch,
      mergeStrategy: selectedMergeStrategy
    }).subscribe(
      () => {
        onPullSuccess?.();
      },
      ({ response }) => {
        onPullError?.(response);
      }
    );
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      disableBackdropClick={disableBackdropClick}
      disableEscapeKeyDown={disableBackdropClick}
    >
      <form>
        <DialogHeader title={<FormattedMessage id="words.pull" defaultMessage="Pull" />} onDismiss={onClose} />
        <DialogBody>
          <FormControl variant="outlined" fullWidth className={classes.formControl}>
            <InputLabel id="remoteBranchToPullLabel">
              <FormattedMessage id="repositories.remoteBranchToPull" defaultMessage="Remote Branch to Pull" />
            </InputLabel>
            <Select
              labelId="remoteBranchToPullLabel"
              name="branch"
              value={selectedBranch}
              onChange={onChange}
              label={<FormattedMessage id="repositories.remoteBranchToPull" defaultMessage="Remote Branch to Pull" />}
              fullWidth
            >
              {branches.map((branch) => (
                <MenuItem key={branch} value={branch}>
                  {branch}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="mergeStrategyLabel">
              <FormattedMessage id="repositories.mergeStrategyLabel" defaultMessage="Merge Strategy" />
            </InputLabel>
            <Select
              labelId="mergeStrategyLabel"
              name="mergeStrategy"
              value={selectedMergeStrategy}
              onChange={onChange}
              label={<FormattedMessage id="repositories.mergeStrategyLabel" defaultMessage="Merge Strategy" />}
              fullWidth
            >
              {mergeStrategies.map((strategy) => (
                <MenuItem key={strategy.key} value={strategy.key}>
                  {strategy.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogBody>
        <DialogFooter>
          <Button variant="outlined" color="default" onClick={onClose}>
            <FormattedMessage id="words.cancel" defaultMessage="Cancel" />
          </Button>
          <Button type="submit" variant="contained" color="primary" onClick={pull} disabled={selectedBranch === ''}>
            <FormattedMessage id="words.ok" defaultMessage="Ok" />
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}