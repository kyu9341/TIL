[이 링크](https://web.dev/webcodecs/?utm_source=email&utm_medium=webdev_news)를 번역한 문서입니다.
# Chrome Web Codecs

### 비디오 처리 workflow

Video encoders는 프레임을 인코딩된 chunk 로 변환한다. Video decoders는 그 반대입니다. Track readers 는 비디오 트랙을 일련의 프레임으로 바꾼다. 설계상 이러한 모든 변환이 비동기적으로 발생하는데,  WebCodecs API는 비디오 처리의 무거운 작업을 메인 스레드에서 제거하여 웹 응답성을 유지하려고 한다.

현재 WebCodecs에서 페이지에 프레임을 표시하는 유일한 방법은 ImageBitmap으로 변환하여 캔버스에 비트맵을 그리거나 WebGLTexture로 변환하는 것이다.

### 작동중인 WebCodecs

### **인코딩**

모든 것은 `VideoFrame` 으로 시작한다. 기존 그림을 `VideoFrame`객체로 변환하는 방법에는 두 가지가 있다. 

첫 번째는 [ImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap) 으로부터 `frame` 을 직접 만드는 것이다. `VideoFrame()`생성자를 호출하고 비트맵과 프레젠테이션 타임 스탬프를 제공하면 된다.

```tsx
let cnv = document.createElement('canvas');
// draw something on the canvas
…
let bitmap = await createImageBitmap(cnv);
let frame_from_bitmap = new VideoFrame(bitmap, { timestamp: 0 });
```

![Screen Shot 2020-11-18 at 01 11 18 AM](https://user-images.githubusercontent.com/49153756/99542672-abbdc880-29f5-11eb-8f6d-5f75f6626786.png)

두 번째는 `VideoTrackReader`를 사용하여 `MediaStreamTrack`에 새 프레임이 나타날 때마다 호출되는 기능을 설정하는 것이다. 이것은 카메라나 화면에서 비디오 스트림을 캡쳐해야 할 때 유용하다.

```tsx
let frames_from_stream = [];
let stream = await navigator.mediaDevices.getUserMedia({ … });
let vtr = new VideoTrackReader(stream.getVideoTracks()[0]);
vtr.start((frame) => {
  frames_from_stream.push(frame);
});
```


![Screen Shot 2020-11-18 at 01 16 39 AM](https://user-images.githubusercontent.com/49153756/99542681-ae202280-29f5-11eb-8f36-9b65fa17d705.png)

출처에 관계없이, 프레임은 `VideoEncoder` 를 통해  `EncodedVideoChunk` 객체로 인코딩 될 수 있다.

인코딩 전에 `VideoEncoder` sms 두 개의 JavaScript 객체가 필요하다.

- 인코딩된 청크와 오류를 처리하는 두 가지 함수로 dictionary를 초기화 해야 한다. 이러한 기능은 개발자가 정의하고 `VideoEncoder` 생성자에게 전달된 후에는 변경할 수 없다.
- 출력 비디오 스트림에 대한 매개 변수를 포함하는 인코더 구성 개체. 이러한 파라미터는 나중에 `configure()`를 호출하여 변경할 수 있다.

```tsx
const init = {
  output: handleChunk,
  error: (e) => {
    console.log(e.message);
  }
};

let config = {
  codec: 'vp8',
  width: 640,
  height: 480,
  bitrate: 8_000_000,     // 8 Mbps
  framerate: 30,
};

let encoder = new VideoEncoder(init);
encoder.configure(config);
```

인코더가 설정되면 프레임을 받아들이기 시작할 준비가 된다. 미디어 스트림에서 프레임이 나올 때 `VideoTrackReader.start()` 에 주어진 콜백은 인코더에 프레임을 펌핑하여 주기적으로 키프레임을 삽입하고 인코더가 들어오는 프레임으로 압도되지 않는지 체크한다. 

`configure()`과 `encode()` 모두 실제 작업이 완료될 때까지 기다리지 않고 즉시 반환한다. 여러 프레임이 동시에 인코딩위해 큐를 설정할 수 있지만 error report를 귀찮게 할 수 있다. 오류는 즉시 예외를 발생시키거나 `error()` 콜백(callback)을 호출하여 보고한다. 일부 오류는 즉시 발생하고, 다른 오류는 인코딩하는 동안에만 발생한다. 

인코딩이 성공적으로 완료되면 `output()` 콜백이 인수로 인코딩된 새 `chunk`로 호출된다. 여기서 또 다른 중요한 세부사항은 `encode()`이 프레임을 소모한다는 것인데, 프레임이 나중에 필요한 경우(예를 들어 다른 인코더와 인코딩하려면) `clone()`을 호출하여 복제해야 한다.

```tsx
let frame_counter = 0;
let pending_outputs = 0;
let vtr = new VideoTrackReader(stream.getVideoTracks()[0]);

vtr.start((frame) => {
  if (pending_outputs > 30) {
    // Too many frames in flight, encoder is overwhelmed
    // let's drop this frame.
    return;
  }
  frame_counter++;
  pending_outputs++;
  const insert_keyframe = (frame_counter % 150) == 0;
  encoder.encode(frame, { keyFrame: insert_keyframe });
});
```

마지막으로 인코딩된 비디오의 chunk가 인코더에서 나올 때 이를 처리하는 함수를 쓰면서 인코딩을 마쳐야 할 때다. 일반적으로 이 기능은 네트워크를 통해 데이터 chunk를 전송하거나 저장하기 위해 미디어 컨테이너에 데이터를 저장한다.

```tsx
function handleChunk(chunk) {
  let data = new Uint8Array(chunk.data);  // actual bytes of encoded data
  let timestamp = chunk.timestamp;        // media time in microseconds
  let is_key = chunk.type == 'key';       // can also be 'delta'
  pending_outputs--;
  fetch(`/upload_chunk?timestamp=${timestamp}&type=${chunk.type}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: data
  });
}
```

어느 시점에서 보류 중인 모든 인코딩 요청이 완료되었는지 확인해야 하는 경우 `flush()`를 호출하고 promise을 기다린다.

```tsx
await encoder.flush();
```


### 디코딩

`VideoDecoder` 설정은 `VideoEncoder`에 대해 수행된 것과 유사하다. 즉, decoder가 생성될 때 두 가지 `function`이 전달되고, 코덱 파라미터가 `configure()` 된다. codec parmater 집합은 코덱마다 다를 수 있다. 예를 들어 `H264`의 경우 현재 `AVCC` 전송 기능이 있는 바이너리 BLOB를 지정해야 함

```tsx
const init = {
  output: handleFrame,
  error: (e) => {
    console.log(e.message);
  }
};

const config = {
  codec: 'vp8',
  codedWidth: 640,
  codedHeight: 480
};

let decoder = new VideoDecoder(init);
decoder.configure(config);
```

디코더가 초기화되면, `EncodedVideoChunk` 객체로 디코더를 공급할 수 있다. `chunk`를 생성하려면 data의 `BufferSource` 와 프레임 타임스탬프(마이크로초)만 있으면 된다. 새로 인코딩된 `chunk`를 해독하는 실제 사용 사례는 상상하기 어렵지만(아래 데모 제외) 인코더에서 방출되는 모든 `chunk`는 있는 그대로 디코더에 대한 준비가 되어 있다. 위에서 말한 `encoder`의 메소드의 비동기적 특성에 관한 모든 것들은 `decoder`에게도 똑같이 적용된다.

```tsx
let responses = await downloadVideoChunksFromServer(timestamp);
for (let i = 0; i < responses.length; i++) {
  let chunk = new EncodedVideoChunk({
    timestamp: responses[i].timestamp,
    data: new Uint8Array ( responses[i].body )
  });
  decoder.decode(chunk);
}
await decoder.flush();
```

![image](https://user-images.githubusercontent.com/49153756/99552031-e62c6300-29ff-11eb-83a1-2e46bb668cfb.png)

이제 갓 디코딩된 프레임을 페이지에 어떻게 보여줄 수 있는지 보여줄 때다. decoder output callback(`handleFrame()`)이 빨리 돌아오는지 확인하는 것이 좋다. 아래 예에서는 렌더링을 위해 준비된 프레임 대기열에만 프레임을 추가한다. 렌더링은 별도로 수행되며, 다음 세 단계로 구성된다.

- VideoFrame을 ImageBitmap으로 변환
- 프레임을 보여줄 적합한 시기를 기다림
- 캔버스에 이미지를 그림

프레임이 더 이상 필요하지 않으면, garbage collector가 기본 메모리를 얻기 전에 기본 메모리를 해제하기 위해  `destroy()` 를 호출하면 웹 응용 프로그램에서 사용하는 평균 메모리 양이 감소한다.

```tsx
let cnv = document.getElementById('canvas_to_render');
let ctx = cnv.getContext('2d', { alpha: false });
let ready_frames = [];
let underflow = true;
let time_base = 0;

function handleFrame(frame) {
  ready_frames.push(frame);
  if (underflow)
    setTimeout(render_frame, 0);
}

function delay(time_ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, time_ms);
  });
}

function calculateTimeTillNextFrame(timestamp) {
  if (time_base == 0)
    time_base = performance.now();
  let media_time = performance.now() - time_base;
  return Math.max(0, (timestamp / 1000) - media_time);
}

async function render_frame() {
  if (ready_frames.length == 0) {
    underflow = true;
    return;
  }
  let frame = ready_frames.shift();
  underflow = false;

  let bitmap = await frame.createImageBitmap();
  // Based on the frame's timestamp calculate how much of real time waiting
  // is needed before showing the next frame.
  let time_till_next_frame = calculateTimeTillNextFrame(frame.timestamp);
  await delay(time_till_next_frame);
  ctx.drawImage(bitmap, 0, 0);

  // Immediately schedule rendering of the next frame
  setTimeout(render_frame, 0);
  frame.destroy();
}
```

아래의 데모에는 두 개의 캔버스가 표시되며, 첫 번째 캔버스는 디스플레이의 새로 고침 속도로 애니메이션화되며, 두 번째 캔버스는 WebCodecs API를 사용하여 인코딩 및 디코딩된 30 FPS의 VideoTrackReader에 의해 캡처된 프레임 순서를 보여준다.

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <!-- meta http-equiv="origin-trial" content="AoSY6Q4OOuuZVXTqOwJlfk4n77EL0esumtLRHj+9V97JoFfLq4AKsWlza8A8HmxTx1PU7SSzpjWK6F62bwWLPQYAAAB3eyJvcmlnaW4iOiJodHRwczovL3dlYmNvZGVjcy1ibG9ncG9zdC1kZW1vLmdsaXRjaC5tZTo0NDMiLCJmZWF0dXJlIjoiV2ViQ29kZWNzIiwiZXhwaXJ5IjoxNjA1NDc0OTQ4LCJpc1N1YmRvbWFpbiI6dHJ1ZX0=" -->
  <meta http-equiv="origin-trial" content="AmR2n5JC+SAgnVeguZLITRN3SnlUTntXi4mzRmGEQ5QjyB3+V/TN2AYvJzAMFMtQpNezb/vGhiLqBPxCsrYzywcAAAB3eyJvcmlnaW4iOiJodHRwczovL3dlYmNvZGVjcy1ibG9ncG9zdC1kZW1vLmdsaXRjaC5tZTo0NDMiLCJmZWF0dXJlIjoiV2ViQ29kZWNzIiwiZXhwaXJ5IjoxNjA4MjU2MDU4LCJpc1N1YmRvbWFpbiI6dHJ1ZX0=">
  <title>WebCodecs API demo: Encoding and Decoding</title>
  <style>
    canvas {
      padding: 10px;
      background: gold;
    }

    button {
      background-color: #555555;
      border: none;
      color: white;
      padding: 15px 32px;
      width: 150px;
      text-align: center;
      display: block;
      font-size: 16px;
    }
  </style>
</head>

<body>
  <canvas id="src" width="640" height="480"></canvas>
  <button onclick="playPause()">Pause</button>
  <canvas id="dst" width="640" height="480"></canvas>
  <script>
    let codec_string = "vp8";
    let keep_going = true;

    function playPause() {
      keep_going = !keep_going;
      let btn = document.querySelector("button");
      if (keep_going) {
        btn.innerText = "Pause";
      } else {
        btn.innerText = "Play";
      }
    }

    function delay(time_ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, time_ms);
      });
    }

    async function startDrawing() {
      let cnv = document.getElementById("src");
      var ctx = cnv.getContext('2d', { alpha: false });

      ctx.fillStyle = "white";
      let width = cnv.width;
      let height = cnv.height;
      let cx = width / 2;
      let cy = height / 2;
      let r = Math.min(width, height) / 5;
      let drawOneFrame = function (time) {
        let angle = Math.PI * 2 * (time / 5000);
        let scale = 1 + 0.3 * Math.sin(Math.PI * 2 * (time / 7000));
        ctx.save();
        ctx.fillRect(0, 0, width, height);

        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.scale(scale, scale);

        ctx.font = '30px Verdana';
        ctx.fillStyle = 'black';
        const text = "😊📹📷Hello WebCodecs 🎥🎞️😊";
        const size = ctx.measureText(text).width;
        ctx.fillText(text, -size / 2, 0);
        ctx.restore();
        window.requestAnimationFrame(drawOneFrame);
      }
      window.requestAnimationFrame(drawOneFrame);
    }

    function captureAndEncode(processChunk) {
      let cnv = document.getElementById("src");
      let fps = 30;
      let pending_outputs = 0;
      let frame_counter = 0;
      let stream = cnv.captureStream(fps);
      let vtr = new VideoTrackReader(stream.getVideoTracks()[0]);

      const init = {
        output: (chunk) => {
          pending_outputs--;
          processChunk(chunk);
        },
        error: (e) => {
          console.log(e.message);
          vtr.stop();
        }
      };

      const config = {
        codec: codec_string,
        width: cnv.width,
        height: cnv.height,
        bitrate: 10e6,
        framerate: fps,
      };

      let encoder = new VideoEncoder(init);
      encoder.configure(config);

      vtr.start((frame) => {
        if (!keep_going)
          return;
        if (pending_outputs > 30) {
          // Too many frames in flight, encoder is overwhelmed
          // let's drop this frame.
          return;
        }
        frame_counter++;
        pending_outputs++;
        const insert_keyframe = (frame_counter % 150) == 0;
        encoder.encode(frame, { keyFrame: insert_keyframe });
      });
    }

    function startDecodingAndRendering() {
      let cnv = document.getElementById("dst");
      let ctx = cnv.getContext("2d", { alpha: false });
      let ready_frames = [];
      let underflow = true;
      let time_base = 0;

      function calculateTimeTillNextFrame(timestamp) {
        if (time_base == 0)
          time_base = performance.now();
        let media_time = performance.now() - time_base;
        return Math.max(0, (timestamp / 1000) - media_time);
      }

      async function renderFrame() {
        if (ready_frames.length == 0) {
          underflow = true;
          return;
        }
        let frame = ready_frames.shift();
        underflow = false;

        let bitmap = await frame.createImageBitmap();        
        // Based on the frame's timestamp calculate how much of real time waiting
        // is needed before showing the next frame.
        let time_till_next_frame = calculateTimeTillNextFrame(frame.timestamp);
        await delay(time_till_next_frame);
        ctx.drawImage(bitmap, 0, 0);        

        // Immediately schedule rendering of the next frame
        setTimeout(renderFrame, 0);
        frame.destroy();
        bitmap.close();
      }

      function handleFrame(frame) {
        ready_frames.push(frame);
        if (underflow) {
          underflow = false;
          setTimeout(renderFrame, 0);
        }
      }

      const init = {
        output: handleFrame,
        error: (e) => {
          console.log(e.message);
        }
      };

      const config = {
        codec: codec_string,
        codedWidth: cnv.width,
        codedHeight: cnv.height
      };

      let decoder = new VideoDecoder(init);
      decoder.configure(config);
      return decoder;
    }

    function main() {
      if (!("VideoEncoder" in window)) {
        document.body.innerHTML = "<h1>WebCodecs API is not supported.</h1>";
        return;
      }
      startDrawing();
      let decoder = startDecodingAndRendering();
      captureAndEncode((chunk) => {
        decoder.decode(chunk);
      });
    }

    document.body.onload = main;
  </script>

</body>

</html>
```

---
[https://web.dev/webcodecs/?utm_source=email&utm_medium=webdev_news](https://web.dev/webcodecs/?utm_source=email&utm_medium=webdev_news)

[https://github.com/WICG/web-codecs/blob/master/explainer.md](https://github.com/WICG/web-codecs/blob/master/explainer.md)

[https://developers.chrome.com/origintrials/#/register_trial/-7811493553674125311](https://developers.chrome.com/origintrials/#/register_trial/-7811493553674125311)