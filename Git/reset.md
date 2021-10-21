# reset 명령어 정리

`git reset` 명령어는 특정 커밋으로 되돌아갈 수 있는데, 되돌린 버전 이후의 버전들은 히스토리에서 삭제된다.

### `reset` 옵션

- `-sort` : `index` 보존 (`add`한 상태, `staged`상태), 워킹 디렉토리 파일 보존
  - 즉, 모두 보존
- `-mixed` : `index` 취소 (`add`하기 전 상태, `unstaged`상태), 워킹 디렉토리 파일 보존
  - 기본 옵션
- `-hard` : `index` 취소 (`add`하기 전 상태, `unstaged`상태), 워킹 디렉토리 파일 삭제
  - 즉, 모두 취소 (파일 내용까지 되돌림)
  - `stage` 에 들어가지 않은 수정한 파일들을 수정 이전으로 되돌리는 방법
    - `git reset --hard` ⇒ 모든 파일을 되돌림
    - `git checkout -- <파일명>` ⇒ 특정 파일에 대한 변경만 되돌림

> `index` : 다음에 커밋할 스냅샷 (`Staging Area`)

### `git add` 취소 (파일 상태를 `unstaged`로 변경)

- `git reset HEAD <file>` 명령을 통해 취소 가능
- 뒤에 파일명이 없으면 `add`한 파일 전체를 취소

### `git commit` 취소

- **방법 1** : `commit`을 취소하고 해당 파일들은 `staged` 상태로 워킹 디렉토리에 보존
  - `git reset —soft HEAD^`
- **방법 2** : `commit`을 취소하고 해당 파일들은 `unstaged` 상태로 워킹 디렉토리에 보존
  - `git reset --mixed HAED^` : 기본 옵션
  - `git reset HEAD^` : 위와 동일
  - `git reset HEAD~2` : 마지막 2개의 `commit`을 취소
- **방법 3** : `commit`을 취소하고 해당 파일들은 `unstaged` 상태로 워킹 디렉토리에서 삭제
  - `git reset --hard HEAD^`
- - **워킹 디렉토리를 원격 저장소의 마지막 `commit` 상태로 되돌리는 방법**
    - `git reset --hard HEAD`
    - 이 명령을 사용하면 원격 저장소의 마지막 `commit` 이후의 워킹 디렉토리와 `add`했던 파일들이 모두 사라지므로 주의가 필요하다.

### `commit message` 변경

- `git commit -amend`

### `git push` 취소

- 이 명령은 자신의 `local`의 내용을 `remote`에 강제로 덮어씌우는 것이기 때문에 주의가 필요하다.
  - 되돌아간 `commit` 이후의 모든 `commit` 정보가 사라짐
  - 동기화 문제 발생 가능

1. 위킹 디렉토리에서 `commit`을 되돌린다.
   - 가장 최근의 `commit`을 취소하고 워킹 디렉토리를 되돌림
     - `git reset HEAD^`
   - 원하는 시점으로 워킹 디렉토리를 되돌림
     - `git reflog` or `git log -g` 로 확인
     - `git reset HEAD@{number}` or `git reset [commit id]` → 원하는 시점으로 `reset`
2. 되돌려진 상태에서 다시 `commit`
3. 원격 저장소에 강제로 `push`
   - `git push origin [branch name] -f` or `git push origin +[branch name]`

위의 방법을 보면 원격 저장소에 내가 만들었던 커밋들을 제거할 수 있어 좋은 해결책 같지만, 팀원들과 협업을 진행하는 브랜치인 경우 커밋들을 되돌리기 전에 다른 팀원이 내가 작성한 커밋들을 이미 `pull`해서 사용중이라면, 그때부터 다른 팀원의 로컬 저장소에는 내가 되돌린 커밋들이 남아있게 된다.

그 커밋들이 되돌려진 것을 모르는 팀원은 자신이 작업한 커밋들과 함께 `push`하면, 되돌렸던 커밋들이 다시 원격 저장소에 추가되게 된다. 즉, 혼자 사용하는 브랜치에 사용하는 것이 아니라면, 주의해서 사용해야 한다.

### 참고: git push options

- `-u` : 최초에 한 번만 저장소명과 브랜치명을 입력하고 그 이후에는 모든 인자를 생략 가능
- `-f` (`--force`) : 로컬 저장소의 `commit` 히스토리를 원격 저장소의 `commit` 히스토리로 강제로 덮어쓴다.

---

> 참고
>
> [https://gmlwjd9405.github.io/2018/05/25/git-add-cancle.html](https://gmlwjd9405.github.io/2018/05/25/git-add-cancle.html)
>
> [https://jupiny.com/2019/03/19/revert-commits-in-remote-repository/](https://jupiny.com/2019/03/19/revert-commits-in-remote-repository/)
>
> [https://git-scm.com/book/ko/v2/Git-도구-Reset-명확히-알고-가기](https://git-scm.com/book/ko/v2/Git-%EB%8F%84%EA%B5%AC-Reset-%EB%AA%85%ED%99%95%ED%9E%88-%EC%95%8C%EA%B3%A0-%EA%B0%80%EA%B8%B0)
>
> [https://victorydntmd.tistory.com/79](https://victorydntmd.tistory.com/79)
