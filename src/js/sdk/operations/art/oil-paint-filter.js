/*
 * Photo Editor SDK - photoeditorsdk.com
 * Copyright (c) 2013-2015 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */
import Utils from '../../lib/utils'
import Filter from '../filters/filter'

/**
 * BW Filter
 * @class
 * @alias PhotoEditorSDK.Filters.BWFilter
 * @extends {PhotoEditorSDK.Filter}
 */
class OilPaintFilter extends Filter {
  constructor (...args) {
    super(...args)

    this._options = Utils.defaults(this._options, {
      contrast: 1.0
    })

    /**
     * The fragment shader for this primitive
     * @return {String}
     * @private
     */
    this._fragmentShader = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_image;

      void main() {
        vec4 texColor = texture2D(u_image, v_texCoord);
        gl_FragColor = vec4(((texColor.rgb - vec3(0.5)) * 2.0 + vec3(0.5) * texColor.a), texColor.a);
      }
    `
  }

  /**
   * Renders the primitive (WebGL)
   * @param  {WebGLRenderer} renderer
   * @param  {WebGLTexture} inputTexture
   * @param  {WebGLFramebuffer} outputFBO
   * @param  {WebGLTexture} outputTexture
   * @return {Promise}
   */
  /* istanbul ignore next */
  renderWebGL (renderer, inputTexture, outputFBO, outputTexture) {
    if (!this._glslPrograms[renderer.id]) {
      this._glslPrograms[renderer.id] = renderer.setupGLSLProgram(
        null,
        this._fragmentShader
      )
    }

    renderer.runProgram(this._glslPrograms[renderer.id], {
      inputTexture,
      outputFBO,
      outputTexture,
      switchBuffer: false
    })
  }

  /**
   * Renders the primitive (Canvas)
   * @param  {Canvas} canvas
   */
  renderCanvas (renderer, canvas) {
    const context = canvas.getContext('2d')
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    var contrast = this._options.contrast

    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var index = (canvas.width * y + x) * 4

        imageData.data[index] = (imageData.data[index] - 127) * contrast + 127
        imageData.data[index + 1] = (imageData.data[index + 1] - 127) * contrast + 127
        imageData.data[index + 2] = (imageData.data[index + 2] - 127) * contrast + 127
      }
    }

    const outputContext = canvas.getContext('2d')
    outputContext.putImageData(imageData, 0, 0)
  }
  /**
   * A unique string that identifies this operation. Can be used to select
   * the active filter.
   * @type {String}
   */
  static get identifier () {
    return 'oil'
  }

  /**
   * The name that is displayed in the UI
   * @type {String}
   */
  get name () {
    return 'Oil'
  }
}

export default OilPaintFilter