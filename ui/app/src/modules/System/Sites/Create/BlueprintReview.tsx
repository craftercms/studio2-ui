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

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { SiteState } from '../../../../models/Site';
import { MarketplacePlugin, MarketplacePluginParameter } from '../../../../models/MarketplacePlugin';
import { defineMessages, useIntl } from 'react-intl';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import palette from '../../../../styles/palette';

const useStyles = makeStyles((theme: Theme) => ({
  review: {
    maxWidth: '600px',
    margin: 'auto'
  },
  section: {
    marginBottom: '0'
  },
  bold: {
    fontWeight: 'bold'
  },
  inline: {
    display: 'inline'
  },
  edit: {
    color: theme.palette.primary.main,
    '& svg': {
      fontSize: '1.2rem'
    }
  },
  noDescription: {
    color: palette.gray.medium2
  },
  showPassword: {
    color: theme.palette.primary.main,
    padding: '1px',
    marginLeft: '5px',
    '& svg': {
      fontSize: '1rem'
    }
  }
}));

interface BlueprintReviewProps {
  inputs: SiteState;
  blueprint: MarketplacePlugin;

  onGoTo(step: number): any;
}

const messages = defineMessages({
  siteInfo: {
    id: 'createSiteDialog.siteInfo',
    defaultMessage: 'Site Info'
  },
  blueprintStrategy: {
    id: 'createSiteDialog.blueprintStrategy',
    defaultMessage: 'Create from plugin'
  },
  gitStrategy: {
    id: 'createSiteDialog.gitStrategy',
    defaultMessage: 'Existing remote git repo clone'
  },
  creationStrategy: {
    id: 'createSiteDialog.creationStrategy',
    defaultMessage: 'Creation Strategy'
  },
  additionalOptions: {
    id: 'createSiteDialog.additionalOptions',
    defaultMessage: 'Additional Options'
  },
  remoteName: {
    id: 'createSiteDialog.remoteName',
    defaultMessage: 'Git Remote Name'
  },
  remoteURL: {
    id: 'createSiteDialog.remoteURL',
    defaultMessage: 'Git Repo URL'
  },
  remoteBranch: {
    id: 'createSiteDialog.remoteBranch',
    defaultMessage: 'Git Branch'
  },
  siteId: {
    id: 'createSiteDialog.siteId',
    defaultMessage: 'Site ID'
  },
  siteName: {
    id: 'createSiteDialog.siteName',
    defaultMessage: 'Site Name'
  },
  sandboxBranch: {
    id: 'createSiteDialog.sandboxBranch',
    defaultMessage: 'Sandbox Branch'
  },
  userNameAndPassword: {
    id: 'createSiteDialog.userNameAndPassword',
    defaultMessage: 'Username & Password'
  },
  token: {
    id: 'createSiteDialog.token',
    defaultMessage: 'Token'
  },
  privateKey: {
    id: 'createSiteDialog.privateKey',
    defaultMessage: 'Private Key'
  },
  authentication: {
    id: 'createSiteDialog.authentication',
    defaultMessage: 'Authentication'
  },
  noDescription: {
    id: 'createSiteDialog.noDescription',
    defaultMessage: 'No description supplied'
  },
  description: {
    id: 'createSiteDialog.description',
    defaultMessage: 'Description'
  },
  blueprint: {
    id: 'createSiteDialog.plugin',
    defaultMessage: 'Blueprint'
  },
  blueprintParameters: {
    id: 'createSiteDialog.blueprintParameters',
    defaultMessage: 'Blueprint Parameters'
  },
  useDefaultValue: {
    id: 'createSiteDialog.useDefaultValue',
    defaultMessage: 'use default value'
  }
});

function BlueprintReview(props: BlueprintReviewProps) {
  const classes = useStyles({});
  const { onGoTo, inputs, blueprint } = props;
  const [passwordFields, setPasswordFields] = useState(null);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (blueprint.parameters) {
      let fields: any = {};
      blueprint.parameters.forEach((parameter: MarketplacePluginParameter) => {
        if (parameter.type === 'PASSWORD') {
          fields[parameter.name] = false;
        }
      });
      setPasswordFields(fields);
    }
  }, [blueprint]);

  function renderAuth(type: string) {
    if (type === 'basic') {
      return formatMessage(messages.userNameAndPassword);
    } else if (type === 'token') {
      return formatMessage(messages.token);
    } else {
      return formatMessage(messages.privateKey);
    }
  }

  function showPassword(parameter: MarketplacePluginParameter) {
    setPasswordFields({ ...passwordFields, [parameter.name]: !passwordFields[parameter.name] });
  }

  function renderSingleParameter(parameter: MarketplacePluginParameter) {
    if (inputs.blueprintFields[parameter.name] && parameter.type === 'STRING') {
      return inputs.blueprintFields[parameter.name];
    } else if (parameter.type === 'STRING') {
      return parameter.defaultValue;
    } else if (inputs.blueprintFields[parameter.name] && parameter.type === 'PASSWORD') {
      return (
        <span>
          {passwordFields && passwordFields[parameter.name] ? inputs.blueprintFields[parameter.name] : '********'}
          <IconButton
            edge="end"
            className={classes.showPassword}
            aria-label="toggle password visibility"
            onClick={() => {
              showPassword(parameter);
            }}
          >
            {passwordFields && passwordFields[parameter.name] ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </span>
      );
    } else {
      return '********';
    }
  }

  function renderBlueprintParameters() {
    return blueprint.parameters.map((parameter, index) => {
      return (
        <Typography variant="body2" gutterBottom key={index}>
          <span className={classes.bold}>{parameter.label}: </span>
          {renderSingleParameter(parameter)}
        </Typography>
      );
    });
  }

  function renderGitOptions() {
    return (
      <div>
        {inputs.repoUrl && (
          <Typography variant="body2" gutterBottom>
            <span className={classes.bold}>{formatMessage(messages.remoteURL)}: </span> {inputs.repoUrl}
          </Typography>
        )}
        <Typography variant="body2" gutterBottom>
          <span className={classes.bold}>{formatMessage(messages.remoteName)}:</span>
          {` ${inputs.repoRemoteName ? inputs.repoRemoteName : 'origin'}`}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <span className={classes.bold}>{formatMessage(messages.remoteBranch)}: </span>{' '}
          {inputs.repoRemoteBranch ? inputs.repoRemoteBranch : 'master'}
        </Typography>
        {inputs.repoAuthentication !== 'none' && (
          <Typography variant="body2" gutterBottom>
            <span className={classes.bold}>{formatMessage(messages.authentication)}:</span>{' '}
            {renderAuth(inputs.repoAuthentication)}
          </Typography>
        )}
      </div>
    );
  }

  return (
    <div className={classes.review}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.section}>
            {formatMessage(messages.creationStrategy)}
            <IconButton aria-label="goto" className={classes.edit} onClick={() => onGoTo(0)}>
              <EditIcon />
            </IconButton>
          </Typography>
          {blueprint.id !== 'GIT' ? (
            <div>
              <Typography variant="body2" gutterBottom>
                {formatMessage(messages.blueprintStrategy)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <span className={classes.bold}>{formatMessage(messages.blueprint)}: </span>{' '}
                {blueprint && blueprint.name}
              </Typography>
            </div>
          ) : (
            <div>
              <Typography variant="body2" gutterBottom>
                {formatMessage(messages.gitStrategy)}
              </Typography>
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.section}>
            {formatMessage(messages.siteInfo)}
            <IconButton aria-label="goto" className={classes.edit} onClick={() => onGoTo(1)}>
              <EditIcon />
            </IconButton>
          </Typography>
          <Typography variant="body2" gutterBottom noWrap>
            <span className={classes.bold}>{formatMessage(messages.siteName)}: </span> {inputs.siteName}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <span className={classes.bold}>{formatMessage(messages.siteId)}: </span> {inputs.siteId}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <span className={classes.bold}>{formatMessage(messages.description)}:</span>
            {` `}
            {inputs.description ? (
              inputs.description
            ) : (
              <span className={classes.noDescription}>({formatMessage(messages.noDescription)})</span>
            )}
          </Typography>
          {blueprint.source !== 'GIT' && blueprint.id === 'GIT' && renderGitOptions()}
          <Typography variant="body2" gutterBottom>
            <span className={classes.bold}>{formatMessage(messages.sandboxBranch)}:</span>
            {` ${inputs.sandboxBranch ? inputs.sandboxBranch : 'master'}`}
          </Typography>
        </Grid>
        {blueprint.parameters && !!blueprint.parameters.length && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom className={classes.section}>
              {formatMessage(messages.blueprintParameters)}
              <IconButton aria-label="goto" className={classes.edit} onClick={() => onGoTo(1)}>
                <EditIcon />
              </IconButton>
            </Typography>
            {renderBlueprintParameters()}
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default BlueprintReview;
