(() => {
  'use strict';

  const vertexSource = `#version 300 es
    out vec2 uv;
    void main() {
      vec2 point = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
      uv = vec2(point.x, 1.0 - point.y);
      gl_Position = vec4(point * 2.0 - 1.0, 0.0, 1.0);
    }`;

  const fragmentSource = `#version 300 es
    precision highp float;
    in vec2 uv;
    uniform sampler2D frame;
    out vec4 color;

    vec4 weights(float t) {
      float t2 = t*t;
      float t3 = t2*t;
      return vec4(-0.5*t + t2 - 0.5*t3,
                  1.0 - 2.5*t2 + 1.5*t3,
                  0.5*t + 2.0*t2 - 1.5*t3,
                  -0.5*t2 + 0.5*t3);
    }

    void main() {
      ivec2 size = textureSize(frame, 0);
      vec2 pixel = uv * vec2(size) - 0.5;
      ivec2 origin = ivec2(floor(pixel));
      vec4 xWeights = weights(fract(pixel.x));
      vec4 yWeights = weights(fract(pixel.y));
      vec3 sum = vec3(0.0);
      vec3 low = vec3(1.0);
      vec3 high = vec3(0.0);
      for (int y = 0; y < 4; y++) {
        for (int x = 0; x < 4; x++) {
          ivec2 texel = clamp(origin + ivec2(x-1, y-1), ivec2(0), size-1);
          vec3 value = texelFetch(frame, texel, 0).rgb;
          sum += value * xWeights[x] * yWeights[y];
          if (x > 0 && x < 3 && y > 0 && y < 3) {
            low = min(low, value);
            high = max(high, value);
          }
        }
      }
      color = vec4(clamp(sum, low, high), 1.0);
    }`;

  function createProgram(gl) {
    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
      gl.deleteShader(shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Video shader failed to link');
    return program;
  }

  window.createVideoResampler = (video, canvas, report) => {
    let mode = 'off';
    let gl, program, texture;
    let callback = null;
    let usingFrameCallback = false;
    let lastTime = -1;
    let lastResult = '';
    let failed = false;
    let inputWidth = 0;
    let inputHeight = 0;

    function status(state, width = 0, height = 0) {
      const visible = state === 'active';
      canvas.hidden = !visible;
      canvas.parentElement.classList.toggle('upscale-active', visible);
      const key = [state, width, height].join(':');
      if (lastResult === key) return;
      lastResult = key;
      report({ state, width, height });
    }

    function cancel() {
      if (callback === null) return;
      if (usingFrameCallback) video.cancelVideoFrameCallback(callback);
      else cancelAnimationFrame(callback);
      callback = null;
    }

    function shouldRender() {
      return mode !== 'off' && !document.hidden &&
        document.pictureInPictureElement !== video && !video.webkitDisplayingFullscreen &&
        video.readyState >= 2 && !video.seeking && video.videoWidth > 0 && !failed;
    }

    function draw() {
      if (!shouldRender()) return;
      try {
        if (!program) {
          gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
          if (!gl) throw new Error('WebGL2 unavailable');
          program = createProgram(gl);
          texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          gl.useProgram(program);
        }
        const width = video.videoWidth;
        const height = video.videoHeight;
        const longEdge = mode === 'ultra' ? 3840 : 2560;
        const shortEdge = mode === 'ultra' ? 2160 : 1440;
        const viewportLimit = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
        const scale = Math.min(longEdge / Math.max(width, height), shortEdge / Math.min(width, height),
          viewportLimit[0] / width, viewportLimit[1] / height);
        if (scale <= 1) {
          status('native');
          return;
        }
        const outWidth = Math.round(width * scale);
        const outHeight = Math.round(height * scale);
        if (canvas.width !== outWidth || canvas.height !== outHeight) {
          canvas.width = outWidth;
          canvas.height = outHeight;
          gl.viewport(0, 0, outWidth, outHeight);
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if (inputWidth !== width || inputHeight !== height) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
          inputWidth = width;
          inputHeight = height;
        } else {
          gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, video);
        }
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (gl.getError() !== gl.NO_ERROR) throw new Error('Unable to render a video frame');
        lastTime = video.currentTime;
        status('active', outWidth, outHeight);
      } catch {
        failed = true;
        status('unavailable');
      }
    }

    function tick() {
      callback = null;
      if (!shouldRender()) return;
      if (usingFrameCallback || lastTime !== video.currentTime) draw();
      schedule();
    }

    function schedule() {
      if (callback !== null || video.paused || video.ended || !shouldRender() || lastResult === 'native:0:0') return;
      usingFrameCallback = typeof video.requestVideoFrameCallback === 'function';
      callback = usingFrameCallback ? video.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
    }

    function refresh() {
      cancel();
      if (mode === 'off') return status('off');
      if (failed) return status('unavailable');
      if (!shouldRender()) return status('pending');
      draw();
      schedule();
    }

    for (const event of ['loadeddata', 'playing', 'seeked', 'resize', 'enterpictureinpicture',
      'leavepictureinpicture', 'webkitbeginfullscreen', 'webkitendfullscreen']) {
      video.addEventListener(event, refresh);
    }
    for (const event of ['pause', 'ended', 'seeking']) video.addEventListener(event, cancel);
    document.addEventListener('visibilitychange', refresh);
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      program = null;
      inputWidth = inputHeight = 0;
      failed = true;
      refresh();
    });
    canvas.addEventListener('webglcontextrestored', () => {
      failed = false;
      refresh();
    });

    return {
      setMode(value) {
        mode = value;
        refresh();
      },
      reset() {
        cancel();
        lastTime = -1;
        status(mode === 'off' ? 'off' : 'pending');
        // Release UHD backing storage when the player is left.
        canvas.width = canvas.height = 1;
      },
    };
  };
})();
