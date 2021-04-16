# MVC, MVP, MVVM

- 각 계층을 분리시킴으로써 코드의 재활용성을 높이고 불필요한 중복을 막기위해
- 모델과 뷰의 의존성을 어떻게 구성하고 제어하는지에 따라 각 패턴이 분류됨

### MVC

`Model`, `View`, `Controller`로 구성

<img width="423" alt="mvc" src="https://user-images.githubusercontent.com/49153756/114960316-bfd0fd80-9ea1-11eb-95f5-7db569c2c227.png">

- `Controller`는 여러개의 `View`를 선택할 수 있는 `1:n` 구조
- `Controller`는 `View`를 선택할 뿐 직접 업데이트 하지 않음.
  - `View`는 `Controller`를 알지 못함

---

- `Model` : 애플리케이션에서 사용되는 데이터 및 데이터 처리 로직이 존재
- `View` : 사용자에게 보여지는 UI
- `Controller` : 사용자의 입력을 받고 처리하는 부분

---

1. `Controller`로 사용자의 입력(`Action`)이 들어옴
2. `Controller`는 사용자의 `Action`를 확인하고, `Model`을 업데이트
3. `Controller`는 `Model`을 나타내줄 `View`를 선택
4. `View`는 `Model`을 이용하여 화면을 나타냄.

---

**장점**

- 널리 사용되고 있는 패턴이라는 점에 걸맞게 가장 단순
- 단순하다 보니 보편적으로 많이 사용되는 디자인패턴
- 서로 역할이 분리되어 각자의 역할에 집중할 수 있게 개발
  - 유지보수성, 확장성 그리고 유연성이 증가하고, 중복 코딩이라는 문제점이 사라진다.

**단점**

- `MVC` 패턴의 단점은 `View`와 `Model` 사이의 의존성이 높다는 것이다.
- `View`와 `Model`의 높은 의존성은 어플리케이션이 커질 수록 복잡하지고 유지보수가 어렵게 만들 수 있다.
- (사용자 `input`, 처리, 화면에 뿌리는 것 모두 `Controller`가 담당) → `Controller`가 점점 비대해짐 → `MVP` 등장

### MVP

`Model`, `View`, `Presenter`

<img width="476" alt="mvp" src="https://user-images.githubusercontent.com/49153756/114960313-be9fd080-9ea1-11eb-8020-6275b4d9020a.png">

- `Model`과 `View`는 `MVC`와 동일하지만 사용자 입력을 `View`에서 받고, `Model`과 `View`는 각각 `Presenter`와 상호 작용한다.
  - 항상 `Presenter`을 거쳐서 동작
- `View`와 `Model`은 서로를 알필요가 전혀 없고, `Presenter`만 알면 된다.
- → `MVC`의 단점인 `View`와 `Model`의 의존성이 없어짐.

---

- `Model` : 애플리케이션에서 사용되는 데이터 및 데이터 처리 로직이 존재
- `View` : 사용자에게 보여지는 UI
- `Presenter` : `View`에서 요청한 정보를 `Model`로 부터 가공해서 `View`로 전달하는 부분

---

1. `View`로 사용자 입력이 들어옴
2. `View`는 `Presenter`에 작업 요청
3. `Presenter`에서 필요한 데이터를 `Model`에 요청
4. `Model`은 `Presenter`에 필요한 데이터를 응답
5. `Presenter`는 `View`에 데이터를 응답
6. `View`는 `Presenter`로부터 받은 데이터로 화면에 보여줌

---

**장점**

- `View`와 `Model`의 의존성이 없다는 것
- `MVP` 패턴은 `MVC` 패턴의 단점이었던 `View`와 `Model`의 의존성을 해결
  - (`Presenter`를 통해서만 데이터를 전달 받기 때문)

**단점**

- `View`와 `Model`은 의존성이 없는 대신`View`와 `Presenter`가 `1:1`로 강한 의존성을 가지게 됨.
- 이런 단점을 해결할 또 다른 프레임워크가 등장 → `MVVM`

### MVVM

`Model`, `View`, `ViewModel`

<img width="438" alt="mvvm" src="https://user-images.githubusercontent.com/49153756/114960311-bcd60d00-9ea1-11eb-849d-6c601f08f214.png">

- `MVVM`은 두가지 디자인 패턴을 사용한다.
  - `Command`패턴과 `Data Binding`
- 이 두가지 패턴으로 인해 `View`와 `ViewModel`은 의존성이 완전히 사라지게 됨
- `MVP`와 마찬가지로 `View`에서 입력이 들어옴.
- 입력이 들어오면 `Command` 패턴을 통해 `ViewModel`에 명령을 내리게 되고 `Data Binding`으로 인해 `ViewModel`의 값이 변화하면 바로 `View`의 정보가 바뀐다.

---

- `Model` : 애플리케이션에서 사용되는 데이터 및 데이터 처리 로직이 존재
- `View` : 사용자에게 보여지는 UI
- `View Model` : `View`를 표현하기 위해 만든 `View`를 위한 `Model`
  - `View`를 나타내 주기 위한 `Model`이자 `View`를 나타내기 위한 데이터 처리를 하는 부분

---

1. 사용자의 `Action`들은 `View`를 통해 들어옴
2. `View`에 `Action`이 들어오면, `Command` 패턴으로 `View Model`에 `Action`을 전달
3. `View Model`은 `Model`에게 데이터를 요청
4. `Model`은 `View Model`에게 요청받은 데이터를 응답
5. `View Model`은 응답 받은 데이터를 가공하여 저장
6. `View`는 `View Model`과 `Data Binding`하여 화면을 나타냄

---

**장점**

- `MVVM` 패턴은 `View`와 `Model` 사이의 의존성이 없다. 또한 `Command` 패턴과 `Data Binding`을 사용하여 `View`와 `View Model` 사이의 의존성 또한 없앤 디자인패턴.
- 각각의 부분은 독립적이기 때문에 모듈화 하여 개발할 수 있다.

**단점**

- `ViewModel`의 설계가 쉽지 않음.
- 데이터 바인딩기법을 통해 `View`를 변경할 때 많은 코드의 작성을 필요로 하므로 간단한 `View`나 로직을 만들 때에도 하는 일에 비해 많은 코드의 작성을 하게 됨.

---

> 참고
>
> [https://www.thekpop.net/2020/03/design-pattern-04-mvc-mvp-mvvm-3.html](https://www.thekpop.net/2020/03/design-pattern-04-mvc-mvp-mvvm-3.html)
>
> [https://beomy.tistory.com/43](https://beomy.tistory.com/43)
>
> [https://magi82.github.io/android-mvc-mvp-mvvm/](https://magi82.github.io/android-mvc-mvp-mvvm/)
>
> [https://velog.io/@addiescode/디자인-패턴-MVC-MVVM](https://velog.io/@addiescode/%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B4-MVC-MVVM)
>
> [https://www.youtube.com/watch?v=bjVAVm3t5cQ](https://www.youtube.com/watch?v=bjVAVm3t5cQ)
>
> [https://hackersstudy.tistory.com/71](https://hackersstudy.tistory.com/71)
>
> [https://mygumi.tistory.com/304](https://mygumi.tistory.com/304)
