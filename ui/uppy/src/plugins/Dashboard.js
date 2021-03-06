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

const UppyDashboard = require('@uppy/dashboard');
const DashboardUI = require('../components/Dashboard');

const StatusBar = require('@uppy/status-bar');
const Informer = require('@uppy/informer');
const ThumbnailGenerator = require('@uppy/thumbnail-generator');
const findAllDOMElements = require('@uppy/utils/lib/findAllDOMElements');

class Dashboard extends UppyDashboard {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.defaultLocale = {
      ...this.defaultLocale,
      strings: {
        ...this.defaultLocale.strings,
        validating: 'Validating',
        validateAndRetry: 'Accept changes',
        rejectAll: 'Reject all changes',
        acceptAll: 'Accept all changes',
        clear: 'Clear',
        cancelPending: 'Cancel pending',
        clearCompleted: 'Clear completed',
        renamingFromTo: 'Renaming from %{from} to %{to}',
        minimize: 'Minimize',
        close: 'Close'
      }
    };
    this.opts = {
      ...this.opts,
      thumbnailWidth: 120,
      proudlyDisplayPoweredByUppy: false,
      disableStatusBar: true
    };

    this.i18nInit();
  }

  addFiles = (files) => {
    const descriptors = files.map((file) => ({
      source: this.id,
      name: file.name,
      type: file.type,
      data: file,
      meta: {
        // path of the file relative to the ancestor directory the user selected.
        // e.g. 'docs/Old Prague/airbnb.pdf'
        relativePath: file.relativePath || null,
        // sitePolicy custom value
        validating: true,
        path: file.relativePath
          ? this.opts.path + file.relativePath.substring(0, file.relativePath.lastIndexOf('/'))
          : this.opts.path
      }
    }));

    try {
      this.uppy.addFiles(descriptors);
    } catch (err) {
      this.uppy.log(err);
    }
  };

  handleComplete = () => {
    const files = this.uppy.getFiles();
    let completeFiles = 0;
    let invalidFiles = 0;
    files.forEach((file) => {
      if (file.progress.uploadComplete) {
        completeFiles++;
      }
      if (file.meta.allowed === false || file.meta.suggestedName) {
        invalidFiles++;
      }
    });

    const allFilesCompleted = files.length === completeFiles + invalidFiles;

    if (allFilesCompleted) {
      this.opts.onPendingChanges(false);
    }
  };

  validateFilesPolicy = (files) => {
    if (files.length === 0) return;
    const fileIdLookup = {};
    const invalidFiles = this.getPluginState().invalidFiles;

    this.opts
      .validateActionPolicy(
        this.opts.site,
        files.map((file) => {
          let target = `${file.meta.path}/${file.name}`;
          fileIdLookup[target] = file.id;
          return {
            type: 'CREATE',
            target,
            contentMetadata: {
              fileSize: file.size
            }
          };
        })
      )
      .subscribe((response) => {
        let uploading = false;
        response.forEach(({ allowed, modifiedValue, target }) => {
          let fileId = fileIdLookup[target];
          this.uppy.setFileMeta(fileId, {
            validating: false,
            allowed,
            ...(modifiedValue && { suggestedName: modifiedValue.replace(/^.*[\\\/]/, '') })
          });
          if (allowed && modifiedValue === null) {
            this.uppy.retryUpload(fileId);
            uploading = true;
          } else {
            invalidFiles[fileId] = true;
          }
        });
        this.opts.onPendingChanges(uploading);
        this.setPluginState({
          invalidFiles: invalidFiles
        });
      });
  };

  validateAndRetry = (fileID) => {
    const invalidFiles = { ...this.getPluginState().invalidFiles };
    invalidFiles[fileID] = false;
    this.setPluginState({ invalidFiles });
    this.uppy.setFileMeta(fileID, {
      allowed: true,
      suggestedName: null
    });
    this.uppy.retryUpload(fileID);
  };

  validateAndRemove = (fileID) => {
    const invalidFiles = { ...this.getPluginState().invalidFiles };
    if (invalidFiles[fileID]) {
      invalidFiles[fileID] = false;
    }
    this.setPluginState({ invalidFiles });
    this.uppy.removeFile(fileID);
  };

  cancelPending = () => {
    const invalidFiles = { ...this.getPluginState().invalidFiles };
    this.uppy.getFiles().forEach((file) => {
      if (!file.progress.uploadComplete) {
        if (invalidFiles[file.id]) {
          invalidFiles[file.id] = false;
        }
        this.uppy.removeFile(file.id);
      }
    });
    this.setPluginState({ invalidFiles });
    this.opts.onPendingChanges(false);
  };

  clearCompleted = () => {
    this.uppy.getFiles().forEach((file) => {
      if (file.progress.uploadComplete) {
        this.uppy.removeFile(file.id);
      }
    });
  };

  rejectAll = () => {
    const invalidFiles = { ...this.getPluginState().invalidFiles };
    Object.keys(invalidFiles).forEach((fileID) => {
      if (invalidFiles[fileID]) {
        invalidFiles[fileID] = false;
        this.uppy.removeFile(fileID);
      }
    });
    this.setPluginState({ invalidFiles });
  };

  confirmAll = () => {
    const invalidFiles = { ...this.getPluginState().invalidFiles };
    Object.keys(invalidFiles).forEach((fileID) => {
      if (invalidFiles[fileID]) {
        invalidFiles[fileID] = false;
        const file = this.uppy.getFile(fileID);
        if (file.meta.allowed) {
          this.uppy.setFileMeta(fileID, {
            allowed: true,
            suggestedName: null
          });
          this.uppy.retryUpload(fileID);
        } else {
          this.uppy.removeFile(fileID);
        }
      }
    });
    this.setPluginState({ invalidFiles });
  };

  initEvents = () => {
    // Modal open button
    if (this.opts.trigger && !this.opts.inline) {
      const showModalTrigger = findAllDOMElements(this.opts.trigger);
      if (showModalTrigger) {
        showModalTrigger.forEach((trigger) => trigger.addEventListener('click', this.openModal));
      } else {
        this.uppy.log(
          'Dashboard modal trigger not found. Make sure `trigger` is set in Dashboard options, unless you are planning to call `dashboard.openModal()` method yourself',
          'warning'
        );
      }
    }

    this.startListeningToResize();
    document.addEventListener('paste', this.handlePasteOnBody);

    this.uppy.on('plugin-remove', this.removeTarget);
    this.uppy.on('file-added', this.hideAllPanels);
    this.uppy.on('dashboard:modal-closed', this.hideAllPanels);
    this.uppy.on('file-editor:complete', this.hideAllPanels);
    this.uppy.on('complete', this.handleComplete);

    // ___Why fire on capture?
    //    Because this.ifFocusedOnUppyRecently needs to change before onUpdate() fires.
    document.addEventListener('focus', this.recordIfFocusedOnUppyRecently, true);
    document.addEventListener('click', this.recordIfFocusedOnUppyRecently, true);

    if (this.opts.inline) {
      this.el.addEventListener('keydown', this.handleKeyDownInInline);
    }

    this.uppy.on('files-added', this.validateFilesPolicy);
  };

  removeEvents = () => {
    const showModalTrigger = findAllDOMElements(this.opts.trigger);
    if (!this.opts.inline && showModalTrigger) {
      showModalTrigger.forEach((trigger) => trigger.removeEventListener('click', this.openModal));
    }

    this.stopListeningToResize();
    document.removeEventListener('paste', this.handlePasteOnBody);

    window.removeEventListener('popstate', this.handlePopState, false);
    this.uppy.off('plugin-remove', this.removeTarget);
    this.uppy.off('file-added', this.hideAllPanels);
    this.uppy.off('dashboard:modal-closed', this.hideAllPanels);
    this.uppy.off('complete', this.handleComplete);

    document.removeEventListener('focus', this.recordIfFocusedOnUppyRecently);
    document.removeEventListener('click', this.recordIfFocusedOnUppyRecently);

    if (this.opts.inline) {
      this.el.removeEventListener('keydown', this.handleKeyDownInInline);
    }

    this.uppy.off('files-added', this.validateFilesPolicy);
  };

  render = (state) => {
    const pluginState = this.getPluginState();
    const { files, capabilities, allowNewUpload } = state;

    // TODO: move this to Core, to share between Status Bar and Dashboard
    // (and any other plugin that might need it, too)
    const newFiles = Object.keys(files).filter((file) => {
      return !files[file].progress.uploadStarted;
    });

    const uploadStartedFiles = Object.keys(files).filter((file) => {
      return files[file].progress.uploadStarted;
    });

    const pausedFiles = Object.keys(files).filter((file) => {
      return files[file].isPaused;
    });

    const completeFiles = Object.keys(files).filter((file) => {
      return files[file].progress.uploadComplete;
    });

    const erroredFiles = Object.keys(files).filter((file) => {
      return files[file].error;
    });

    const inProgressFiles = Object.keys(files).filter((file) => {
      return !files[file].progress.uploadComplete && files[file].progress.uploadStarted;
    });

    const inProgressNotPausedFiles = inProgressFiles.filter((file) => {
      return !files[file].isPaused;
    });

    const processingFiles = Object.keys(files).filter((file) => {
      return files[file].progress.preprocess || files[file].progress.postprocess;
    });

    const isUploadStarted = uploadStartedFiles.length > 0;

    const isAllComplete =
      state.totalProgress === 100 && completeFiles.length === Object.keys(files).length && processingFiles.length === 0;

    const isAllErrored = isUploadStarted && erroredFiles.length === uploadStartedFiles.length;

    const isAllPaused = inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length;

    const hasInvalidFiles = Object.values(pluginState.invalidFiles).some((value) => value);

    const acquirers = this._getAcquirers(pluginState.targets);
    const progressindicators = this._getProgressIndicators(pluginState.targets);
    const editors = this._getEditors(pluginState.targets);

    let theme;
    if (this.opts.theme === 'auto') {
      theme = capabilities.darkMode ? 'dark' : 'light';
    } else {
      theme = this.opts.theme;
    }

    if (['files', 'folders', 'both'].indexOf(this.opts.fileManagerSelectionType) < 0) {
      this.opts.fileManagerSelectionType = 'files';
      console.error(
        `Unsupported option for "fileManagerSelectionType". Using default of "${this.opts.fileManagerSelectionType}".`
      );
    }

    return DashboardUI({
      state,
      isHidden: pluginState.isHidden,
      files,
      newFiles,
      uploadStartedFiles,
      completeFiles,
      erroredFiles,
      inProgressFiles,
      inProgressNotPausedFiles,
      processingFiles,
      isUploadStarted,
      isAllComplete,
      isAllErrored,
      isAllPaused,
      hasInvalidFiles,
      totalFileCount: Object.keys(files).length,
      totalProgress: state.totalProgress,
      allowNewUpload,
      acquirers,
      theme,
      direction: this.opts.direction,
      activePickerPanel: pluginState.activePickerPanel,
      showFileEditor: pluginState.showFileEditor,
      animateOpenClose: this.opts.animateOpenClose,
      isClosing: pluginState.isClosing,
      getPlugin: this.uppy.getPlugin,
      progressindicators: progressindicators,
      editors: editors,
      autoProceed: this.uppy.opts.autoProceed,
      id: this.id,
      closeModal: this.requestCloseModal,
      handleClickOutside: this.handleClickOutside,
      handleInputChange: this.handleInputChange,
      handlePaste: this.handlePaste,
      inline: this.opts.inline,
      showPanel: this.showPanel,
      hideAllPanels: this.hideAllPanels,
      log: this.uppy.log,
      i18n: this.i18n,
      i18nArray: this.i18nArray,
      removeFile: this.validateAndRemove,
      uppy: this.uppy,
      info: this.uppy.info,
      note: this.opts.note,
      metaFields: pluginState.metaFields,
      resumableUploads: capabilities.resumableUploads || false,
      individualCancellation: capabilities.individualCancellation,
      isMobileDevice: capabilities.isMobileDevice,
      pauseUpload: this.uppy.pauseResume,
      retryUpload: this.uppy.retryUpload,
      // region header
      onMinimized: this.opts.onMinimized,
      onClose: this.opts.onClose,
      title: this.opts.title,
      // endregion
      // region Site policy functions
      cancelPending: this.cancelPending,
      clearCompleted: this.clearCompleted,
      validateAndRetry: this.validateAndRetry,
      rejectAll: this.rejectAll,
      confirmAll: this.confirmAll,
      // endregion
      cancelUpload: this.cancelUpload,
      cancelAll: this.uppy.cancelAll,
      fileCardFor: pluginState.fileCardFor,
      toggleFileCard: this.toggleFileCard,
      toggleAddFilesPanel: this.toggleAddFilesPanel,
      showAddFilesPanel: pluginState.showAddFilesPanel,
      saveFileCard: this.saveFileCard,
      openFileEditor: this.openFileEditor,
      canEditFile: this.canEditFile,
      width: this.opts.width,
      height: this.opts.height,
      showLinkToFileUploadResult: this.opts.showLinkToFileUploadResult,
      fileManagerSelectionType: this.opts.fileManagerSelectionType,
      proudlyDisplayPoweredByUppy: this.opts.proudlyDisplayPoweredByUppy,
      hideCancelButton: this.opts.hideCancelButton,
      hideRetryButton: this.opts.hideRetryButton,
      hidePauseResumeButton: this.opts.hidePauseResumeButton,
      showRemoveButtonAfterComplete: this.opts.showRemoveButtonAfterComplete,
      containerWidth: pluginState.containerWidth,
      containerHeight: pluginState.containerHeight,
      areInsidesReadyToBeVisible: pluginState.areInsidesReadyToBeVisible,
      isTargetDOMEl: this.isTargetDOMEl,
      parentElement: this.el,
      allowedFileTypes: this.uppy.opts.restrictions.allowedFileTypes,
      maxNumberOfFiles: this.uppy.opts.restrictions.maxNumberOfFiles,
      showSelectedFiles: this.opts.showSelectedFiles,
      handleRequestThumbnail: this.handleRequestThumbnail,
      handleCancelThumbnail: this.handleCancelThumbnail,
      doneButtonHandler: this.opts.doneButtonHandler,
      // site policy props
      invalidFiles: pluginState.invalidFiles ?? {},
      // drag props
      isDraggingOver: pluginState.isDraggingOver,
      handleDragOver: this.handleDragOver,
      handleDragLeave: this.handleDragLeave,
      handleDrop: this.handleDrop
    });
  };

  install = () => {
    // Set default state for Dashboard
    this.setPluginState({
      isHidden: true,
      fileCardFor: null,
      activeOverlayType: null,
      showAddFilesPanel: false,
      activePickerPanel: false,
      showFileEditor: false,
      metaFields: this.opts.metaFields,
      targets: [],
      // We'll make them visible once .containerWidth is determined
      areInsidesReadyToBeVisible: false,
      isDraggingOver: false,
      // Site Policy Props
      invalidFiles: {}
    });

    const { inline, closeAfterFinish } = this.opts;
    if (inline && closeAfterFinish) {
      throw new Error(
        '[Dashboard] `closeAfterFinish: true` cannot be used on an inline Dashboard, because an inline Dashboard cannot be closed at all. Either set `inline: false`, or disable the `closeAfterFinish` option.'
      );
    }

    const { allowMultipleUploads } = this.uppy.opts;
    if (allowMultipleUploads && closeAfterFinish) {
      this.uppy.log(
        '[Dashboard] When using `closeAfterFinish`, we recommended setting the `allowMultipleUploads` option to `false` in the Uppy constructor. See https://uppy.io/docs/uppy/#allowMultipleUploads-true',
        'warning'
      );
    }

    const { target } = this.opts;
    if (target) {
      this.mount(target, this);
    }

    const plugins = this.opts.plugins || [];
    plugins.forEach((pluginID) => {
      const plugin = this.uppy.getPlugin(pluginID);
      if (plugin) {
        plugin.mount(this, plugin);
      }
    });

    if (!this.opts.disableStatusBar) {
      this.uppy.use(StatusBar, {
        id: `${this.id}:StatusBar`,
        target: this,
        hideUploadButton: this.opts.hideUploadButton,
        hideRetryButton: this.opts.hideRetryButton,
        hidePauseResumeButton: this.opts.hidePauseResumeButton,
        hideCancelButton: this.opts.hideCancelButton,
        showProgressDetails: this.opts.showProgressDetails,
        hideAfterFinish: this.opts.hideProgressAfterFinish,
        locale: this.opts.locale,
        doneButtonHandler: this.opts.doneButtonHandler
      });
    }

    if (!this.opts.disableInformer) {
      this.uppy.use(Informer, {
        id: `${this.id}:Informer`,
        target: this
      });
    }

    if (!this.opts.disableThumbnailGenerator) {
      this.uppy.use(ThumbnailGenerator, {
        id: `${this.id}:ThumbnailGenerator`,
        thumbnailWidth: this.opts.thumbnailWidth,
        thumbnailType: this.opts.thumbnailType,
        waitForThumbnailsBeforeUpload: this.opts.waitForThumbnailsBeforeUpload,
        // If we don't block on thumbnails, we can lazily generate them
        lazy: !this.opts.waitForThumbnailsBeforeUpload
      });
    }

    // Dark Mode / theme
    this.darkModeMediaQuery =
      typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    const isDarkModeOnFromTheStart = this.darkModeMediaQuery ? this.darkModeMediaQuery.matches : false;
    this.uppy.log(`[Dashboard] Dark mode is ${isDarkModeOnFromTheStart ? 'on' : 'off'}`);
    this.setDarkModeCapability(isDarkModeOnFromTheStart);

    if (this.opts.theme === 'auto') {
      this.darkModeMediaQuery.addListener(this.handleSystemDarkModeChange);
    }

    this.discoverProviderPlugins();
    this.initEvents();
  };
}

module.exports = Dashboard;
