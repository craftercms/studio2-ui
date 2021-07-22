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

import React, { Fragment } from 'react';
import { Resource } from '../../models/Resource';
import TableContainer from '@material-ui/core/TableContainer';
import useStyles from './styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography/Typography';
import { FormattedMessage } from 'react-intl';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import { DetailedItem } from '../../models/Item';
import GlobalAppGridRow from '../GlobalAppGridRow';
import GlobalAppGridCell from '../GlobalAppGridCell';
import LookupTable from '../../models/LookupTable';
import Checkbox from '@material-ui/core/Checkbox';
import MoreVertRounded from '@material-ui/icons/MoreVertRounded';
import ItemDisplay from '../ItemDisplay';
import clsx from 'clsx';
import { DashboardItem } from '../AwaitingApprovalDashlet';
import ExpandLessIcon from '@material-ui/icons/ExpandLessRounded';
import { asLocalizedDateTime } from '../../utils/datetime';
import Tooltip from '@material-ui/core/Tooltip';
import { useLocale } from '../../utils/hooks/useLocale';

interface AwaitingApprovalDashletGridUIProps {
  resource: Resource<DashboardItem[]>;
  itemsLookup: LookupTable<DetailedItem>;
  expandedLookup: LookupTable<boolean>;
  selectedLookup: LookupTable<boolean>;
  publishingTargetLookup: LookupTable<string>;
  isAllChecked: boolean;
  isIndeterminate: boolean;
  onToggleCheckedAll(): void;
  onExpandedRow(path: string, value: boolean): void;
  onItemChecked(path: string): void;
  onItemMenuClick(event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, item: DetailedItem): void;
}

export default function AwaitingApprovalDashletGridUI(props: AwaitingApprovalDashletGridUIProps) {
  const {
    resource,
    onExpandedRow,
    expandedLookup,
    publishingTargetLookup,
    itemsLookup,
    selectedLookup,
    onItemMenuClick,
    onItemChecked,
    isAllChecked,
    isIndeterminate,
    onToggleCheckedAll
  } = props;
  const items = resource.read();
  const classes = useStyles();
  const locale = useLocale();

  return (
    <TableContainer>
      <Table className={classes.tableRoot} size="small">
        <TableHead>
          <GlobalAppGridRow className="hoverDisabled">
            <GlobalAppGridCell className="checkbox">
              <Checkbox
                indeterminate={isIndeterminate}
                checked={isAllChecked || isIndeterminate}
                onChange={onToggleCheckedAll}
              />
            </GlobalAppGridCell>
            <GlobalAppGridCell className="width40 pl0">
              <FormattedMessage id="awaitingApprovalDashlet.item" defaultMessage="Item" />
            </GlobalAppGridCell>
            <GlobalAppGridCell className="width15 ellipsis">
              <FormattedMessage id="awaitingApprovalDashlet.publishingTarget" defaultMessage="Publishing Target" />
            </GlobalAppGridCell>
            <GlobalAppGridCell className="width15 ellipsis">
              <FormattedMessage id="awaitingApprovalDashlet.publishingDate" defaultMessage="Publishing Date" />
            </GlobalAppGridCell>
            <GlobalAppGridCell className="width15 ellipsis">
              <FormattedMessage id="awaitingApprovalDashlet.lastEditedBy" defaultMessage="Last Edited By" />
            </GlobalAppGridCell>
            <GlobalAppGridCell className="width15 ellipsis">
              <FormattedMessage id="awaitingApprovalDashlet.lastEdited" defaultMessage="Last Edited" />
            </GlobalAppGridCell>
            <GlobalAppGridCell className="checkbox" />
          </GlobalAppGridRow>
        </TableHead>
        <TableBody>
          {items.map((dashboardItem, i) => (
            <Fragment key={i}>
              <GlobalAppGridRow onClick={() => onExpandedRow(dashboardItem.path, !expandedLookup[dashboardItem.path])}>
                <GlobalAppGridCell colSpan={7}>
                  <Box display="flex" alignItems="center">
                    <IconButton size="small">
                      {expandedLookup[dashboardItem.path] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <Typography>
                      {dashboardItem.label} ({dashboardItem.children.length})
                    </Typography>
                  </Box>
                </GlobalAppGridCell>
              </GlobalAppGridRow>
              <GlobalAppGridRow className="hoverDisabled">
                <GlobalAppGridCell colSpan={7} className="padded0 bb0">
                  <Collapse in={expandedLookup[dashboardItem.path]}>
                    <Table size="small" className={classes.tableRoot}>
                      <TableBody>
                        {dashboardItem.children.map(
                          (path, i) =>
                            itemsLookup[path] && (
                              <GlobalAppGridRow
                                key={i}
                                onClick={() => {
                                  onItemChecked(path);
                                }}
                              >
                                <GlobalAppGridCell className="checkbox">
                                  <Checkbox
                                    checked={Boolean(selectedLookup[itemsLookup[path].path])}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                    onChange={() => {
                                      onItemChecked(path);
                                    }}
                                  />
                                </GlobalAppGridCell>
                                <GlobalAppGridCell className="ellipsis width40 pl0">
                                  <ItemDisplay
                                    item={itemsLookup[path]}
                                    showNavigableAsLinks={false}
                                    showPublishingTarget={false}
                                  />
                                  <Typography
                                    title={itemsLookup[path].path}
                                    variant="caption"
                                    component="p"
                                    className={clsx(classes.itemPath, classes.ellipsis)}
                                  >
                                    {itemsLookup[path].path}
                                  </Typography>
                                </GlobalAppGridCell>
                                <GlobalAppGridCell className="width15">
                                  {publishingTargetLookup[itemsLookup[path].path]}
                                </GlobalAppGridCell>
                                <GlobalAppGridCell
                                  className="width15"
                                  title={
                                    itemsLookup[path].live.dateScheduled &&
                                    asLocalizedDateTime(
                                      itemsLookup[path].live.dateScheduled,
                                      locale.localeCode,
                                      locale.dateTimeFormatOptions
                                    )
                                  }
                                >
                                  {itemsLookup[path].live.dateScheduled ? (
                                    asLocalizedDateTime(
                                      itemsLookup[path].live.dateScheduled,
                                      locale.localeCode,
                                      locale.dateTimeFormatOptions
                                    )
                                  ) : (
                                    <Typography variant="caption" color="textSecondary">
                                      <FormattedMessage id="words.unpublished" defaultMessage="Unpublished" />
                                    </Typography>
                                  )}
                                </GlobalAppGridCell>
                                <GlobalAppGridCell
                                  className="width15 ellipsis"
                                  title={itemsLookup[path].sandbox.modifier}
                                >
                                  {itemsLookup[path].sandbox.modifier}
                                </GlobalAppGridCell>
                                <GlobalAppGridCell
                                  className="width15 ellipsis"
                                  title={asLocalizedDateTime(
                                    itemsLookup[path].sandbox.dateModified,
                                    locale.localeCode,
                                    locale.dateTimeFormatOptions
                                  )}
                                >
                                  {asLocalizedDateTime(
                                    itemsLookup[path].sandbox.dateModified,
                                    locale.localeCode,
                                    locale.dateTimeFormatOptions
                                  )}
                                </GlobalAppGridCell>
                                <GlobalAppGridCell className="checkbox">
                                  <Tooltip title={<FormattedMessage id="words.options" defaultMessage="Options" />}>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onItemMenuClick(e, itemsLookup[path]);
                                      }}
                                    >
                                      <MoreVertRounded />
                                    </IconButton>
                                  </Tooltip>
                                </GlobalAppGridCell>
                              </GlobalAppGridRow>
                            )
                        )}
                      </TableBody>
                    </Table>
                  </Collapse>
                </GlobalAppGridCell>
              </GlobalAppGridRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
