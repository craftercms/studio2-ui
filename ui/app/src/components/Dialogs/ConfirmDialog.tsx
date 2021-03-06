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

import DialogContent from '@material-ui/core/DialogContent';
import DialogFooter from './DialogFooter';
import DialogContentText from '@material-ui/core/DialogContentText';
import React, { PropsWithChildren, ReactNode } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import StandardAction from '../../models/StandardAction';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import questionGraphicUrl from '../../assets/question.svg';
import { CSSProperties } from '@material-ui/styles';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { useUnmount } from '../../utils/hooks/useUnmount';

const messages = defineMessages({
  accept: {
    id: 'words.accept',
    defaultMessage: 'Accept'
  },
  cancel: {
    id: 'words.cancel',
    defaultMessage: 'Cancel'
  }
});

type ConfirmDialogStateClassKey = 'dialog' | 'dialogImage' | 'dialogBody' | 'dialogTitle' | 'dialogFooter';

type ConfirmDialogStateStyles = Partial<Record<ConfirmDialogStateClassKey, CSSProperties>>;

const useStyles = makeStyles(() =>
  createStyles<ConfirmDialogStateClassKey, ConfirmDialogStateStyles>({
    dialog: (styles) => ({
      '& .MuiPaper-root': {
        borderRadius: '20px'
      },
      ...styles.dialog
    }),
    dialogImage: (styles) => ({
      paddingBottom: '35px',
      ...styles.dialogImage
    }),
    dialogBody: (styles) => ({
      textAlign: 'center',
      padding: '40px 20px 0 !important',
      ...styles.dialogBody
    }),
    dialogTitle: (styles) => ({
      paddingBottom: '5px',
      ...styles.dialogTitle
    }),
    dialogFooter: (styles) => ({
      borderTop: 'none',
      display: 'flex',
      flexDirection: 'column',
      padding: '25px 40px 35px',
      '& button': {
        fontWeight: 600,
        letterSpacing: '0.46px'
      },
      '& > :not(:first-child)': {
        marginTop: '10px',
        marginLeft: 0
      },
      ...styles.dialogFooter
    })
  })
);

interface ConfirmDialogBaseProps {
  open: boolean;
  title?: ReactNode;
  body?: ReactNode;
  hideBackdrop?: boolean;
  imageUrl?: string;
  disableEnforceFocus?: boolean;
  disableEscapeKeyDown?: boolean;
  disableBackdropClick?: boolean;
  maxWidth?: DialogProps['maxWidth'];
  styles?: ConfirmDialogStateStyles;
}

export type ConfirmDialogProps = PropsWithChildren<
  ConfirmDialogBaseProps & {
    classes?: Partial<Record<ConfirmDialogStateClassKey, string>>;
    disableOkButton?: boolean;
    disableCancelButton?: boolean;
    onOk?(): void;
    onCancel?(): void;
    onClose?(): void;
    onClosed?(): void;
    onDismiss?(): void;
  }
>;

export interface ConfirmDialogStateProps extends ConfirmDialogBaseProps {
  onOk?: StandardAction;
  onCancel?: StandardAction;
  onDismiss?: StandardAction;
  onClose?: StandardAction;
  onClosed?: StandardAction;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const classes = useStyles(props.styles);
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="confirmDialogTitle"
      aria-describedby="confirmDialogBody"
      disableEscapeKeyDown={props.disableEscapeKeyDown}
      disableBackdropClick={props.disableBackdropClick}
      disableEnforceFocus={props.disableEnforceFocus}
      hideBackdrop={props.hideBackdrop}
      className={classes.dialog}
      maxWidth={props.maxWidth ?? 'xs'}
      fullWidth
    >
      <ConfirmDialogWrapper {...props} classes={classes} />
    </Dialog>
  );
}

function ConfirmDialogWrapper(props: ConfirmDialogProps) {
  const {
    onOk,
    onCancel,
    body,
    title,
    children,
    classes,
    imageUrl = questionGraphicUrl,
    disableOkButton = false,
    disableCancelButton = false
  } = props;
  const { formatMessage } = useIntl();
  useUnmount(props.onClosed);
  return (
    <>
      <DialogContent id="confirmDialogBody" className={classes.dialogBody}>
        <img src={imageUrl} alt="" className={classes.dialogImage} />
        {title && (
          <Typography variant="body1" component="h2" className={classes.dialogTitle}>
            {title}
          </Typography>
        )}
        {body && (
          <DialogContentText color="textPrimary" variant="body2">
            {body}
          </DialogContentText>
        )}
        {children}
      </DialogContent>
      <DialogFooter className={classes.dialogFooter}>
        {onOk && (
          <PrimaryButton onClick={onOk} autoFocus fullWidth size="large" disabled={disableOkButton}>
            {formatMessage(messages.accept)}
          </PrimaryButton>
        )}
        {onCancel && (
          <SecondaryButton onClick={onCancel} fullWidth size="large" disabled={disableCancelButton}>
            {formatMessage(messages.cancel)}
          </SecondaryButton>
        )}
      </DialogFooter>
    </>
  );
}
