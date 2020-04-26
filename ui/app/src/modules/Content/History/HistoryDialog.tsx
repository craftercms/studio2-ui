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

import React, { PropsWithChildren, useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogHeader from '../../../components/DialogHeader';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import DialogBody from '../../../components/DialogBody';
import makeStyles from '@material-ui/styles/makeStyles';
import createStyles from '@material-ui/styles/createStyles';
import { useSpreadState, useStateResource } from '../../../utils/hooks';
import ContextMenu, { SectionItem } from '../../../components/ContextMenu';
import DialogFooter from '../../../components/DialogFooter';
import { APIError, EntityState } from '../../../models/GlobalState';
import { SuspenseWithEmptyState } from '../../../components/SystemStatus/Suspencified';
import { LookupTable } from '../../../models/LookupTable';
import StandardAction from '../../../models/StandardAction';
import { LegacyVersion } from '../../../models/version';
import { useDispatch } from 'react-redux';
import { historyDialogChangePage } from '../../../state/reducers/dialogs/history';
import { VersionList } from './VersionList';
import TablePagination from '@material-ui/core/TablePagination';
import { Resource } from '../../../models/Resource';
import {
  fetchContentVersion,
  showViewVersionDialog
} from '../../../state/reducers/dialogs/viewVersion';
import { fetchContentTypes } from '../../../state/actions/preview';

const translations = defineMessages({
  previousPage: {
    id: 'pagination.PreviousPage',
    defaultMessage: 'Previous page'
  },
  nextPage: {
    id: 'pagination.nextPage',
    defaultMessage: 'Next page'
  },
  view: {
    id: 'words.view',
    defaultMessage: 'View'
  },
  compareTo: {
    id: 'historyDialog.options.compareTo',
    defaultMessage: 'Compare to...'
  },
  compareToCurrent: {
    id: 'historyDialog.options.compareToCurrent',
    defaultMessage: 'Compare to current'
  },
  compareToPrevious: {
    id: 'historyDialog.options.compareToPrevious',
    defaultMessage: 'Compare to previous'
  },
  revertToPrevious: {
    id: 'historyDialog.options.revertToPrevious',
    defaultMessage: 'Revert to <b>previous</b>'
  },
  revertToThisVersion: {
    id: 'historyDialog.options.revertToThisVersion',
    defaultMessage: 'Revert to <b>this version</b>'
  },
  backToHistoryList: {
    id: 'historyDialog.back.selectRevision',
    defaultMessage: 'Back to history list'
  }
});

const historyStyles = makeStyles(() =>
  createStyles({
    dialogBody: {
      overflow: 'auto'
    },
    dialogFooter: {
      padding: 0
    },
    menuList: {
      padding: 0
    }
  })
);

const paginationStyles = makeStyles(() =>
  createStyles({
    pagination: {
      marginLeft: 'auto',
      background: 'white',
      color: 'black',
      '& p': {
        padding: 0
      },
      '& svg': {
        top: 'inherit'
      },
      '& .hidden': {
        display: 'none'
      }
    },
    toolbar: {
      padding: 0,
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: '20px',
      '& .MuiTablePagination-spacer': {
        display: 'none'
      },
      '& .MuiTablePagination-spacer + p': {
        display: 'none'
      }
    }
  })
);

const menuOptions: LookupTable<SectionItem> = {
  view: {
    id: 'view',
    label: translations.view
  },
  compareTo: {
    id: 'compareTo',
    label: translations.compareTo
  },
  compareToCurrent: {
    id: 'compareToCurrent',
    label: translations.compareToCurrent
  },
  compareToPrevious: {
    id: 'compareToPrevious',
    label: translations.compareToPrevious
  },
  revertToPrevious: {
    id: 'revertToPrevious',
    label: translations.revertToPrevious,
    values: { b: (msg) => <b key={'bold'}>&nbsp;{msg}</b> }
  },
  revertToThisVersion: {
    id: 'revertToThisVersion',
    label: translations.revertToThisVersion,
    values: { b: (msg) => <b key={'bold'}>&nbsp;{msg}</b> }
  }
};

const menuInitialState = {
  sections: [],
  anchorEl: null,
  activeItem: null
};

interface Menu {
  sections: SectionItem[][];
  anchorEl: Element;
  activeItem: LegacyVersion;
}

interface HistoryDialogBaseProps {
  open: boolean;
  path: string;
  isFetching: Boolean;
  error: APIError;
  current: string;
  page: number;
  rowsPerPage: number;
}

export type HistoryDialogProps = PropsWithChildren<HistoryDialogBaseProps & {
  versionsBranch: Partial<EntityState<LegacyVersion>>;
  onClose?(): any;
  onDismiss?(): any;
}>;

export interface HistoryDialogStateProps extends HistoryDialogBaseProps {
  onClose?: StandardAction;
  onDismiss?: StandardAction;
}

export default function HistoryDialog(props: HistoryDialogProps) {
  const { open, onClose, onDismiss, path, rowsPerPage, page, current } = props;
  const { formatMessage } = useIntl();
  const classes = historyStyles({});
  const dispatch = useDispatch();

  const [menu, setMenu] = useSpreadState<Menu>(menuInitialState);

  const versionsResource = useStateResource<LegacyVersion[], HistoryDialogProps>(props, {
    shouldResolve: ({ versionsBranch }) => Boolean(versionsBranch.versions) && !versionsBranch.isFetching,
    shouldReject: ({ versionsBranch }) => Boolean(versionsBranch.error),
    shouldRenew: ({ versionsBranch }, resource) => (
      versionsBranch.isFetching && versionsBranch.complete
    ),
    resultSelector: ({ versionsBranch, page, rowsPerPage }) => (
      versionsBranch.versions.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    ),
    errorSelector: ({ versionsBranch }) => versionsBranch.error
  });

  const paginationResource = useStateResource<number, HistoryDialogProps>(props, {
    shouldResolve: ({ versionsBranch }) => Boolean(versionsBranch.versions) && !versionsBranch.isFetching,
    shouldReject: ({ versionsBranch }) => Boolean(versionsBranch.error),
    shouldRenew: ({ versionsBranch }, resource) => (
      versionsBranch.isFetching && versionsBranch.complete
    ),
    resultSelector: ({ versionsBranch }) => versionsBranch.versions.length,
    errorSelector: ({ versionsBranch }) => versionsBranch.error
  });

  const handleOpenMenu = useCallback(
    (anchorEl, version, isCurrent = false) => {
      if (isCurrent) {
        setMenu({
          sections: [
            [menuOptions.view],
            [menuOptions.compareTo, menuOptions.compareToPrevious],
            [menuOptions.revertToPrevious]
          ],
          anchorEl,
          activeItem: version
        });
      } else {
        setMenu({
          sections: [
            [menuOptions.view],
            [menuOptions.compareTo, menuOptions.compareToCurrent, menuOptions.compareToPrevious],
            [menuOptions.revertToThisVersion]
          ],
          anchorEl,
          activeItem: version
        });
      }
    },
    [setMenu]
  );

  const handleViewItem = (version: LegacyVersion) => {
    dispatch(fetchContentTypes());
    dispatch(fetchContentVersion({ path, versionNumber: version.versionNumber }));
    dispatch(showViewVersionDialog());
    // dispatch(
    //   showViewVersionDialog({
    //     rightActions: [
    //       {
    //         icon: HistoryRoundedIcon,
    //         onClick: showHistoryDialog(),
    //         'aria-label': formatMessage(translations.backToHistoryList)
    //       }
    //     ]
    //   })
    // );
  };

  const handleContextMenuClose = () => {
    setMenu({
      anchorEl: null,
      activeItem: null
    });
  };

  const handleContextMenuItemClicked = (section: SectionItem) => {
    const activeItem = menu.activeItem;
    setMenu(menuInitialState);
    switch (section.id) {
      case 'view': {
        handleViewItem(activeItem);
        break;
      }
      case 'compareTo': {
        break;
      }
      case 'compareToCurrent': {
        break;
      }
      case 'compareToPrevious': {
        break;
      }
      case 'revertToPrevious': {
        break;
      }
      case 'revertToThisVersion': {
        break;
      }
      default:
        break;
    }
  };

  const onPageChanged = (nextPage: number) => {
    dispatch(historyDialogChangePage(nextPage));
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="md" onEscapeKeyDown={onDismiss}>
      <DialogHeader
        title={
          <FormattedMessage id="historyDialog.headerTitle" defaultMessage="Content Item History" />
        }
        onDismiss={onDismiss}
      />
      <DialogBody className={classes.dialogBody}>
        <SuspenseWithEmptyState resource={versionsResource}>
          <VersionList
            resource={versionsResource}
            handleOpenMenu={handleOpenMenu}
            handleItemClick={handleViewItem}
            current={current}
          />
        </SuspenseWithEmptyState>
      </DialogBody>
      <DialogFooter classes={{ root: classes.dialogFooter }}>
        <SuspenseWithEmptyState resource={versionsResource} suspenseProps={{ fallback: null }}>
          <Pagination
            resource={paginationResource}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChanged={onPageChanged}
          />
        </SuspenseWithEmptyState>
      </DialogFooter>
      {Boolean(menu.anchorEl) && (
        <ContextMenu
          open={true}
          anchorEl={menu.anchorEl}
          onClose={handleContextMenuClose}
          sections={menu.sections}
          onMenuItemClicked={handleContextMenuItemClicked}
          classes={{ menuList: classes.menuList }}
        />
      )}
    </Dialog>
  );
}

interface PaginationProps {
  resource: Resource<number>;
  page: number;
  rowsPerPage: number;
  onPageChanged(nextPage: number): void;
}

function Pagination(props: PaginationProps) {
  const classes = paginationStyles({});
  const { formatMessage } = useIntl();
  const { resource, page, rowsPerPage } = props;
  const count = resource.read();
  return (
    <TablePagination
      className={classes.pagination}
      classes={{ root: classes.pagination, selectRoot: 'hidden', toolbar: classes.toolbar }}
      component="div"
      labelRowsPerPage=""
      rowsPerPageOptions={[10, 20, 30]}
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      backIconButtonProps={{
        'aria-label': formatMessage(translations.previousPage)
      }}
      nextIconButtonProps={{
        'aria-label': formatMessage(translations.nextPage)
      }}
      onChangePage={(e: React.MouseEvent<HTMLButtonElement>, nextPage: number) =>
        props.onPageChanged(nextPage)
      }
    />
  );
}