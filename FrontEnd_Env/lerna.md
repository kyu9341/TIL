# [Lerna](https://lerna.js.org/)

대규모 코드베이스를 개별적으로 버전이 지정된 패키지로 분할하는 것은 코드 공유에 매우 유용하다. 그러나 많은 레포지토리에서 변경을 수행하는 것은 지저분하고 추적하기 어렵워지며, 레포지토리 간 테스트는 정말 복잡해진다.

`Lerna`는 `git` 및 `npm`을 사용하여 다중 패키지 레포지토리 관리와 관련된 워크플로우를 최적화하는 도구이다.

## [Commands](https://lerna.js.org/#commands)

- `lerna init` : 새로운 lerna 레포지토리를 생성하거나 기존 레포지토리를 현재 버전의 Lerna로 업그레이드 한다.
  - `--independent / -i` : 독립 버전 관리 모드를 사용
- `lerna bootstrap` : 현재 `Lerna` 레포에 있는 패키지들을 bootstrap한다.
  - 모든 `dependencies`를 설치하고 `cross-dependencies` 를 연결한다.
  - 이 명령은 패키지가 이미 존재하여 `node_modules` 폴더에 있는 것처럼 `require()`에서 패키지명으로 사용 가능하게 해준다.
- `lerna import <pathToRepo>` : 로컬 경로 `<pathToRepo>`의 패키지를 커밋 기록이있는 `packages/<directory-name>`으로 가져온다.
- `lerna publish` : 업데이트 된 패키지의 새로운 release를 생성한다. 새 버전을 요청하고 `git` 과 `npm`의 모든 패키지를 업데이트한다.

---
