# stash

하던 작업을 임시로 저장해둘 때 사용하는 명령어이다. 작업 중 완료되지 않은 부분을 `commit` 하지 않고 나중에 다시 꺼내와 마무리할 수 있다.

![stash](https://user-images.githubusercontent.com/49153756/125614385-5076a19f-6c09-40a9-8c7d-7f7ff14a648d.png)


## 사용법

### 임시 저장

- `git stash`

```bash
$ git stash
$ git stash save
```

`git stash` 혹은 `git stash save`를 실행하면 스택에 새로운 `stash`가 생성되며, 이후 `working directory`는 깨끗해진다.

### stash 목록 확인

- `git stash list`

```bash
$ git stash list
stash@{0}: WIP on master: 049d078 added the index file
stash@{1}: WIP on master: c264051 Revert "added file_size"
stash@{2}: WIP on master: 21d80a5 added number to log
```

지금까지 `stash` 했던 목록을 확인할 수 있다.

### stash 적용

- `git stash apply`

```bash
# 가장 최근의 stash를 가져와 적용한다.
$ git stash apply
# stash 이름(ex. stash@{2})에 해당하는 stash를 적용한다.
$ git stash apply [stash 이름]
```

위의 명령어로는 `Staged` 상태였던 파일을 자동으로 다시 `Staged` 상태로 만들어 주지 않는다. `–-index` 옵션을 주어야 `Staged` 상태까지 복원한다. 이를 통해 원래 작업하던 파일의 상태로 돌아올 수 있다.

```bash
# Staged 상태까지 저장
$ git stash apply --index
```

### stash 제거

- `git stash drop`

```bash
# 가장 최근의 stash를 제거한다.
$ git stash drop
# stash 이름(ex. stash@{2})에 해당하는 stash를 제거한다.
$ git stash drop [stash 이름]
```

`apply` 명령은 단순히 `stash`를 적용만 하기 때문에 적용된 `stash`는 스택에 여전히 남아있는다. 스택에 남은 `stash`까지 제거하고 싶다면 `drop` 명령으로 제거가 가능하다.

> 만약 적용을 하면서 해당 `stash`를 제거하고 싶다면 `git stash pop` 명령을 사용할 수 있다.

```bash
# apply + drop 과 같은 동작을 수행
$ git stash pop
```

### stash 되돌리기

- `git stash show -p | git apply -R`

```bash
# 가장 최근의 stash를 사용하여 패치를 만들고 그것을 거꾸로 적용한다.
$ git stash show -p | git apply -R
# stash 이름(ex. stash@{2})에 해당하는 stash를 이용하여 거꾸로 적용한다.
$ git stash show -p [stash 이름] | git apply -R
```

> 참고
>
> [https://www.lainyzine.com/ko/article/git-stash-usage-saving-changes-without-commit/](https://www.lainyzine.com/ko/article/git-stash-usage-saving-changes-without-commit/)
>
> [https://gmlwjd9405.github.io/2018/05/18/git-stash.html](https://gmlwjd9405.github.io/2018/05/18/git-stash.html)
