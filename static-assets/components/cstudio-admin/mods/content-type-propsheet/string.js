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

CStudioAdminConsole.Tool.ContentTypes.PropertyType.String =
  CStudioAdminConsole.Tool.ContentTypes.PropertyType.String ||
  function(fieldName, containerEl) {
    this.fieldName = fieldName;
    this.containerEl = containerEl;
    return this;
  };

YAHOO.extend(
  CStudioAdminConsole.Tool.ContentTypes.PropertyType.String,
  CStudioAdminConsole.Tool.ContentTypes.PropertyType,
  {
    render: function(value, updateFn, fName, itemId, defaultValue, typeControl, disabled, validations) {
      var _self = this;
      var containerEl = this.containerEl;
      var valueEl = document.createElement('input');
      containerEl.appendChild(valueEl);
      valueEl.value = value;
      valueEl.fieldName = this.fieldName;
      validations && valueEl.setAttribute('data-id', validations.name);

      if (updateFn) {
        var updateFieldFn = function(event, el) {
          updateFn(event, el);
          CStudioAdminConsole.Tool.ContentTypes.visualization.render();
          valueEl.dispatchEvent(new Event('propertyUpdate', { event }));
        };

        var onBlur = function(event, el) {
          if (!el.value.startsWith(validations.startsWith)) {
            if (el.value.startsWith('/')) {
              el.value = validations.startsWith + el.value;
            } else {
              el.value = validations.startsWith + '/' + el.value;
            }
          }
          updateFn(event, el);
          CStudioAdminConsole.Tool.ContentTypes.visualization.render();
        };

        YAHOO.util.Event.on(valueEl, 'keyup', updateFieldFn, valueEl);
        if (validations) {
          if (validations.startsWith) {
            YAHOO.util.Event.on(valueEl, 'blur', onBlur, valueEl);
          }
        }
      }

      if (validations && validations.dependsOn) {
        const dependency = document.querySelector(`[data-id="${validations.dependsOn}"]`);
        valueEl.value = dependency && _self.isDependencyMet(dependency) ? value : '';

        if (dependency) {
          _self.handleDependency(dependency, valueEl, validations, 'value', '', updateFieldFn);
        }
      } else {
        valueEl.value = value;
      }

      this.valueEl = valueEl;
    },

    getValue: function() {
      return this.valueEl.value;
    }
  }
);

CStudioAuthoring.Module.moduleLoaded(
  'cstudio-console-tools-content-types-proptype-string',
  CStudioAdminConsole.Tool.ContentTypes.PropertyType.String
);
