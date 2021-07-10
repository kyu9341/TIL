# Rebase

`rebase`를 사용해서 병합한다면, 내 작업하면서 남겼던 `commit` 중 불필요한 것들은 생략시키고 필요한 `commit`만 남겨서 `master`에 병합하기 때문에 `master`의 `commit`은 항상 깔끔하게 관리된다는 장점이 있다.

똑같은 병합이지만, 나중에 `master`의 `commit`을 볼 때 깔끔하게 볼 수 있어서 여러 명이 협업할 때 유용하다.

## 사용법

### 브랜치 병합

```jsx
$ git rebase master feature
```

```jsx
$ git checkout feature
$ git rebase master
```

- `feature`를 `master`에 `rabase` == `feature`의 `master`에 대한 공통 조상인 `base`를 `master`로 변경한다.

```
1. feature 브랜치로 checkout
2. master 브랜치로 rebase
3. feature 브랜치를 master로 fast-forward merge
```

`rebase`는 보통 리모트 브랜치에 커밋을 깔끔하게 적용하고 싶을 때 사용한다. 아마 이렇게 `rebase` 하는 리모트 브랜치는 직접 관리하는 것이 아니라 그냥 참여하는 브랜치일 것이다.메인 프로젝트에 Patch 를 보낼 준비가 되면 하는 것이 `rebase` 니까 브랜치에서 하던 일을 완전히 마치고 **`origin/master`** 로 `rebase` 한다. 이렇게 `rebase` 하고 나면 프로젝트 관리자는 어떠한 통합작업도 필요 없다. 그냥 **`master`** 브랜치를 **"Fast-forward"** 시키면 된다.

`**rebase` 를 하든지, `merge` 를 하든지 최종 결과물은 같고 커밋 히스토리만 다르다는 것이 중요하다.\*\* `rebase` 의 경우는 브랜치의 변경사항을 순서대로 다른 브랜치에 적용하면서 합치고 `merge` 의 경우는 두 브랜치의 최종결과만을 가지고 합친다.

### 커밋 메세지 여러 개 수정

`rebase` 명령을 이용하면 이전 커밋들을 수정할 수 있다. 현재 작업하는 브랜치에서 각 커밋을 하나하나 수정하는 것이 아니라 어느 시점부터 HEAD까지의 커밋을 한 번에 Rebase 한다.

대화형으로 Rebase를 실행하면 커밋을 처리할 때마다 잠시 멈춘다. 각 커밋의 메시지를 수정하거나 파일을 추가하고 변경하는 등의 일을 진행할 수 있다.

- `-i` 옵션 : 대화형으로 실행
  - 어떤 시점부터 `HEAD`까지 `rebase` 할 것인지 인자로 넘김

마지막 커밋 메시지 세 개를 모두 수정하거나 그 중 몇 개를 수정하는 시나리오를 살펴보자.

`git rebase -i` 의 인자로 편집하려는 마지막 커밋의 부모를 `HEAD~2^`나 `HEAD~3`로 해서 넘긴다. 마지막 세 개의 커밋을 수정하는 것이기 때문에 `~3`이 좀 더 기억하기 쉽다. 그렇지만, 실질적으로 가리키게 되는 것은 수정하려는 커밋의 부모인 네 번째 이전 커밋이다.

```
$ git rebase -i HEAD~3
```

이 명령은 `rebase` 하는 것이기 때문에 메시지의 수정 여부에 관계없이 `HEAD~3..HEAD` 범위에 있는 모든 커밋을 수정한다. 이미 중앙서버에 `push`한 커밋은 절대 고치지 말아야 하는데, `push`한 커밋을 `rebase` 하면 결국 같은 내용을 두 번 `push`하는 것이기 때문에 협업하는 경우 혼란을 겪을 수 있다.

실행하면 Git은 수정하려는 커밋 목록이 첨부된 스크립트를 텍스트 편집기로 열어준다.

```
pick f7f3f6d changed my name a bit
pick 310154e updated README formatting and added blame
pick a5f4a0d added cat-file

# Rebase 710f0f8..a5f4a0d onto 710f0f8
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

이 커밋은 모두 log 명령과는 반대의 순서로 나열된다. 즉, 맨 위가 가장 오래된 커밋인 것이다.

특정 커밋에서 실행을 멈추게 하려면 스크립트를 수정해야 한다. `pick` 이라는 단어를 `edit or e`로 수정하면 그 커밋에서 멈춘다. 가장 오래된 커밋 메시지를 수정하려면 아래와 같이 편집한다.

```
edit f7f3f6d changed my name a bit
pick 310154e updated README formatting and added blame
pick a5f4a0d added cat-file
```

저장하고 편집기를 종료하면 목록에 있는 커밋 중에서 가장 오래된 커밋으로 이동하고, 아래와 같은 메시지를 보여주고, 명령 프롬프트를 보여준다.

```
$ git rebase -i HEAD~3
Stopped at f7f3f6d... changed my name a bit
You can amend the commit now, with

       git commit --amend

Once you’re satisfied with your changes, run

       git rebase --continue
```

`rebase`과정에서 현재 뭘 해야 하는지 메시지로 알려준다. 아래와 같은 명령을 실행하고

`$ git commit --amend`

커밋 메시지를 수정하고 텍스트 편집기를 종료하고 나서 아래 명령을 실행한다.

`$ git rebase --continue`

이렇게 나머지 두 개의 커밋에 적용하면 끝이다. 다른 것도 `pick`을 `edit`로 수정해서 이 작업을 몇 번이든 반복할 수 있다. 매번 `Git`이 멈출 때마다 커밋을 정정할 수 있고 완료할 때까지 계속 할 수 있다.

### 원격 저장소에 push된 커밋 합치기

`rebase` 후에 `force push`를 수행하면 된다. 단, 협업하는 경우라면 다른 개발자가 변경된 커밋들을 사용했다면 문제가 될 수 있으므로 자신만 사용한 브랜치인 경우에만 수행한다.

### 명령어

- `git rebase -i` 는 rebase 될 커밋 리스트를 직접 편집할 수 있게 해주는 기능이다
- `git rebase -i commit_sha` - 주어진 해쉬값의 커밋 이후부터 HEAD까지 rebase 한다
- `git commit --amend` - HEAD 커밋을 수정한다. 또한 rebase 중 커밋의 편집을 완료한다
- `git rebase --continue` - 커밋을 편집한 뒤 rebase를 계속한다

우리는 또한 커밋 리스트를 편집하는 여러 명령어들을 알아보았는데, 각 명령어들의 기능은 다음과 같다

- `pick` - 해당 커밋을 히스토리에 넣는다
- `reword` - 해당 커밋의 메시지를 변경한다
- `edit` - 해당 커밋의 메시지와 작업 내용을 변경한다
- `squash` - 해당 커밋을 이전 커밋과 하나로 합친다
- `fixup` - 해당 커밋을 이전 커밋과 하나로 합친다. 단, 메시지는 이전 커밋의 메시지로 합쳐진다
- `exec` - 쉘 명령을 실행한다
- `drop` - 커밋을 히스토리에서 삭제한다

> [https://flyingsquirrel.medium.com/git-rebase-하는-방법-ce6816fa859d](https://flyingsquirrel.medium.com/git-rebase-%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-ce6816fa859d)
>
> [https://blog.outsider.ne.kr/666](https://blog.outsider.ne.kr/666)
>
> [https://suhwan.dev/2018/01/21/Git-Rebase-1/](https://suhwan.dev/2018/01/21/Git-Rebase-1/)
>
> [https://velog.io/@godori/Git-Rebase](https://velog.io/@godori/Git-Rebase)
>
> [https://backlog.com/git-tutorial/kr/stepup/stepup2_8.html](https://backlog.com/git-tutorial/kr/stepup/stepup2_8.html)
>
> [https://readystory.tistory.com/151](https://readystory.tistory.com/151)
>
> [https://git-scm.com/book/ko/v2/Git-도구-히스토리-단장하기#\_changing_multiple](https://git-scm.com/book/ko/v2/Git-%EB%8F%84%EA%B5%AC-%ED%9E%88%EC%8A%A4%ED%86%A0%EB%A6%AC-%EB%8B%A8%EC%9E%A5%ED%95%98%EA%B8%B0#_changing_multiple)
>
> [https://gamsungcoding.tistory.com/entry/Git-Git-Advanced-Rebase-i-활용법](https://gamsungcoding.tistory.com/entry/Git-Git-Advanced-Rebase-i-%ED%99%9C%EC%9A%A9%EB%B2%95)
