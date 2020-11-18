# Chrome Web Codecs

### 비디오 처리 workflow

Video encoders는 프레임을 인코딩된 chunk 로 변환한다. Video decoders는 그 반대입니다. Track readers 는 비디오 트랙을 일련의 프레임으로 바꾼다. 설계상 이러한 모든 변환이 비동기적으로 발생하는데,  WebCodecs API는 비디오 처리의 무거운 작업을 메인 스레드에서 제거하여 웹 응답성을 유지하려고 한다.

현재 WebCodecs에서 페이지에 프레임을 표시하는 유일한 방법은 ImageBitmap으로 변환하여 캔버스에 비트맵을 그리거나 WebGLTexture로 변환하는 것이다.

### 작동중인 WebCodecs

### **인코딩**

모든 것은 `VideoFrame` 으로 시작한다. 기존 그림을 `VideoFrame`객체로 변환하는 방법에는 두 가지가 있다. 

첫 번째는 `[ImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap)` 으로부터 `frame` 을 직접 만드는 것이다. `VideoFrame()`생성자를 호출하고 비트맵과 프레젠테이션 타임 스탬프를 제공하면 된다.

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

인코더가 설정되면 프레임을 받아들이기 시작할 준비가 된다. 미디어 스트림에서 프레임이 나올 때 `VideoTrackReader.start()` 에 주어진 콜백은 인코더에 프레임을 펌핑하여 주기적으로 키프레임을 삽입하고 인코더가 들어오는 프레임으로 압도되지 않는지 체크한다. `configure()`과 `encode()` 모두 실제 작업이 완료될 때까지 기다리지 않고 즉시 반환한다. 여러 프레임이 동시에 인코딩을 큐에 넣을 수 있도록 한다. 그러나 그것은 오류 보고를 귀찮게 만든다. 오류는 즉시 예외를 발생시키거나 `error()` 콜백(callback)을 호출하여 보고한다. 일부 오류는 즉시 발생하고, 다른 오류는 인코딩하는 동안에만 발생한다. 인코딩이 성공적으로 완료되면 `output()` 콜백이 인수로 인코딩된 새 `chunk`로 호출된다. 여기서 또 다른 중요한 세부사항은 `encode()`이 프레임을 소모한다는 것인데, 프레임이 나중에 필요한 경우(예를 들어 다른 인코더와 인코딩하려면) `clone()`을 호출하여 복제해야 한다.

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



---
[https://web.dev/webcodecs/?utm_source=email&utm_medium=webdev_news](https://web.dev/webcodecs/?utm_source=email&utm_medium=webdev_news)

[https://github.com/WICG/web-codecs/blob/master/explainer.md](https://github.com/WICG/web-codecs/blob/master/explainer.md)

[https://developers.chrome.com/origintrials/#/register_trial/-7811493553674125311](https://developers.chrome.com/origintrials/#/register_trial/-7811493553674125311)