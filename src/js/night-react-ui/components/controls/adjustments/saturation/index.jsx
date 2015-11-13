/*
 * Photo Editor SDK - photoeditorsdk.com
 * Copyright (c) 2013-2015 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

import SaturationControlsComponent from './saturation-controls-component'

export default {
  canvasControls: null,
  controls: SaturationControlsComponent,
  identifier: 'saturation',
  icon: 'controls/adjustments/saturation@2x.png',
  label: 'controls.adjustments.saturation',
  getInitialSharedState: (context) => {
    const operationExistedBefore = context.ui.operationExists('saturation')
    const operation = context.ui.getOrCreateOperation('saturation')
    const initialOptions = {
      saturation: operation.getSaturation()
    }
    return {
      operationExistedBefore,
      operation,
      initialOptions
    }
  },
  isSelectable: (ui) => {
    return ui.isOperationEnabled('saturation')
  }
}