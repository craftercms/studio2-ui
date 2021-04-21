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

import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import Divider from '@material-ui/core/Divider';
import SecondaryButton from '../SecondaryButton';
import AddIcon from '@material-ui/icons/Add';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { UsersGridSkeletonTable } from '../UsersGrid';
import CreateUserDialog from '../CreateUserDialog';
import UserInfoDialog from '../UserInfoDialog';
import { fetchAll } from '../../services/users';
import { PagedArray } from '../../models/PagedArray';
import User from '../../models/User';
import { ApiResponse } from '../../models/ApiResponse';
import { useLogicResource } from '../../utils/hooks';
import { ErrorBoundary } from '../SystemStatus/ErrorBoundary';
import { SuspenseWithEmptyState } from '../SystemStatus/Suspencified';
import UsersGridUI from '../UsersGrid/UsersGridUI';

interface UsersManagementProps {
  passwordRequirementsRegex?: string;
}

const styles = makeStyles((theme) =>
  createStyles({
    title: {
      marginBottom: '25px',
      color: theme.palette.text.primary
    },
    createUser: {
      margin: '10px 0',
      borderRadius: '50px',
      border: 0,
      padding: '5px 25px',
      boxShadow: '0px 3px 5px 0px rgba(0, 0, 0, 0.2)'
    }
  })
);

export default function UsersManagement(props: UsersManagementProps) {
  const classes = styles();
  const {
    passwordRequirementsRegex = '^(?=(?<hasNumbers>.*[0-9]))(?=(?<hasLowercase>.*[a-z]))(?=(?<hasUppercase>.*[A-Z]))(?=(?<hasSpecialChars>.*[~|!`,;/@#$%^&+=]))(?<minLength>.{8,})$'
  } = props;
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [fetching, setFetching] = useState(false);
  const [users, setUsers] = useState<PagedArray<User>>(null);
  const [error, setError] = useState<ApiResponse>();
  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  const fetchUsers = useCallback(() => {
    setFetching(true);
    fetchAll({ limit, offset }).subscribe(
      (users) => {
        setUsers(users);
        setFetching(false);
      },
      ({ response }) => {
        setError(response);
        setFetching(false);
      }
    );
  }, [limit, offset]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const resource = useLogicResource<
    PagedArray<User>,
    { users: PagedArray<User>; error: ApiResponse; fetching: boolean }
  >(
    useMemo(() => ({ users, error, fetching }), [users, error, fetching]),
    {
      shouldResolve: (source) => Boolean(source.users) && !fetching,
      shouldReject: ({ error }) => Boolean(error),
      shouldRenew: (source, resource) => fetching && resource.complete,
      resultSelector: (source) => source.users,
      errorSelector: () => error
    }
  );

  const onUserCreated = () => {
    setOpenCreateUserDialog(false);
    fetchUsers();
  };

  const onUserInfoClose = () => {
    setViewUser(null);
  };

  const onUserEdited = () => {
    fetchUsers();
  };

  const onRowClicked = (user: User) => {
    setViewUser(user);
  };

  const onChangePage = (page: number) => {
    setOffset(page * limit);
  };

  const onChangeRowsPerPage = (e) => {
    setLimit(e.target.value);
  };

  return (
    <section>
      <Typography variant="h4" component="h1" className={classes.title}>
        <FormattedMessage id="GlobalMenu.Users" defaultMessage="Users" />
      </Typography>
      <Divider />
      <SecondaryButton
        startIcon={<AddIcon />}
        className={classes.createUser}
        onClick={() => setOpenCreateUserDialog(true)}
      >
        <FormattedMessage id="sites.createUser" defaultMessage="Create User" />
      </SecondaryButton>
      <Divider />
      <ErrorBoundary>
        <SuspenseWithEmptyState
          resource={resource}
          suspenseProps={{
            fallback: <UsersGridSkeletonTable numOfItems={limit} />
          }}
          withEmptyStateProps={{
            emptyStateProps: {
              title: <FormattedMessage id="usersGrid.emptyStateMessage" defaultMessage="No Users Found" />
            }
          }}
        >
          <UsersGridUI
            resource={resource}
            onRowClicked={onRowClicked}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
          />
        </SuspenseWithEmptyState>
      </ErrorBoundary>
      <CreateUserDialog
        open={openCreateUserDialog}
        onCreateSuccess={onUserCreated}
        onClose={() => setOpenCreateUserDialog(false)}
        passwordRequirementsRegex={passwordRequirementsRegex}
      />
      <UserInfoDialog
        open={Boolean(viewUser)}
        onClose={onUserInfoClose}
        onUserEdited={onUserEdited}
        user={viewUser}
        passwordRequirementsRegex={passwordRequirementsRegex}
      />
    </section>
  );
}